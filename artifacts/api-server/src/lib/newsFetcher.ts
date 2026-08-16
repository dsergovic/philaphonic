/**
 * Live cross-publication news aggregation for Philaphonic.
 *
 * Pulls headlines from freely available RSS feeds of Philadelphia
 * publications, blends them, and caches the result in memory. When live
 * fetching fails (network restrictions, feed changes), callers fall back to
 * the curated dataset in phillyData.ts.
 */
import { logger } from "./logger";
import type { NewsItem } from "./phillyData";

interface FeedSource {
  name: string;
  url: string;
  category: string;
}

const SOURCES: FeedSource[] = [
  { name: "Billy Penn", url: "https://billypenn.com/feed/", category: "City" },
  { name: "PhillyVoice", url: "https://www.phillyvoice.com/feed/", category: "City" },
  { name: "WHYY", url: "https://whyy.org/feed/", category: "News" },
  { name: "Philadelphia Magazine", url: "https://www.phillymag.com/feed/", category: "Culture" },
];

const CACHE_TTL_MS = 5 * 60_000;
const FETCH_TIMEOUT_MS = 5_000;

let cache: { items: NewsItem[]; fetchedAt: number } | null = null;
let inFlight: Promise<NewsItem[] | null> | null = null;

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#8217;|&rsquo;/g, "\u2019")
    .replace(/&#8216;|&lsquo;/g, "\u2018")
    .replace(/&#8220;|&ldquo;/g, "\u201C")
    .replace(/&#8221;|&rdquo;/g, "\u201D")
    .replace(/&#8211;|&ndash;/g, "\u2013")
    .replace(/&#8212;|&mdash;/g, "\u2014")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .trim();
}

function stripHtml(s: string): string {
  const noCdata = s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  return decodeEntities(noCdata.replace(/<[^>]*>/g, " "))
    .replace(/\]\]>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tagContent(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m?.[1] ?? null;
}

function parseFeed(xml: string, source: FeedSource): NewsItem[] {
  const items: NewsItem[] = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  for (const block of blocks.slice(0, 6)) {
    const title = tagContent(block, "title");
    if (!title) continue;
    const link = tagContent(block, "link");
    const pubDate = tagContent(block, "pubDate");
    const description = tagContent(block, "description");
    const published = pubDate ? new Date(decodeEntities(pubDate)) : new Date();
    const summaryRaw = description ? stripHtml(description) : "";
    items.push({
      id: `live-${source.name}-${items.length}-${published.getTime()}`,
      headline: stripHtml(title),
      source: source.name,
      category: source.category,
      summary:
        summaryRaw.length > 220 ? `${summaryRaw.slice(0, 217)}...` : summaryRaw,
      publishedAt: Number.isNaN(published.getTime())
        ? new Date().toISOString()
        : published.toISOString(),
      url: link ? decodeEntities(link) : null,
    });
  }
  return items;
}

async function fetchOne(source: FeedSource): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: { "user-agent": "Philaphonic/1.0 (+https://philaphonic.com)" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseFeed(xml, source);
  } catch (err) {
    logger.warn({ source: source.name, err: String(err) }, "News feed fetch failed");
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAll(): Promise<NewsItem[] | null> {
  const results = await Promise.all(SOURCES.map(fetchOne));
  const merged = results
    .flat()
    .filter((i) => i.headline.length > 0)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  // Require at least two distinct sources for a credible blended feed.
  const distinctSources = new Set(merged.map((i) => i.source));
  if (merged.length < 6 || distinctSources.size < 2) return null;
  return merged.slice(0, 24);
}

/**
 * Returns blended live headlines, or null when live aggregation is
 * unavailable (caller should use the curated fallback).
 */
export async function getLiveNews(): Promise<NewsItem[] | null> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.items;
  }
  if (!inFlight) {
    inFlight = fetchAll()
      .then((items) => {
        if (items) cache = { items, fetchedAt: Date.now() };
        return items;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  const fresh = await inFlight;
  // If this refresh failed but we have stale cache, serve stale.
  if (!fresh && cache) return cache.items;
  return fresh;
}
