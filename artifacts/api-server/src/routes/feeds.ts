import { Router, type IRouter } from "express";
import {
  ListMusicResponse,
  ListNewsResponse,
  ListSocialResponse,
  ListPhotosResponse,
  ListEventsResponse,
  GetWeatherResponse,
} from "@workspace/api-zod";
import {
  musicItems,
  fallbackNews,
  socialPosts,
  photos,
  eventItems,
  rotateWindow,
} from "../lib/phillyData";
import { getLiveNews } from "../lib/newsFetcher";
import { getWeather } from "../lib/weatherFetcher";

const router: IRouter = Router();

router.get("/music", async (_req, res): Promise<void> => {
  // Send the full curated set (not a small subset) — rotateWindow still
  // reorders it over time for a "live" feel, but nothing stays hidden.
  const items = rotateWindow(musicItems, musicItems.length, 25_000);
  res.json(ListMusicResponse.parse(items));
});

router.get("/news", async (req, res): Promise<void> => {
  const live = await getLiveNews();
  if (live) {
    res.json(ListNewsResponse.parse(rotateWindow(live, 20, 40_000)));
    return;
  }
  req.log.info("Serving curated news fallback");
  const fallback = fallbackNews();
  res.json(ListNewsResponse.parse(rotateWindow(fallback, fallback.length, 40_000)));
});

router.get("/social", async (_req, res): Promise<void> => {
  const posts = socialPosts();
  const items = rotateWindow(posts, posts.length, 30_000);
  res.json(ListSocialResponse.parse(items));
});

router.get("/photos", async (_req, res): Promise<void> => {
  // Send the full curated set (not a rotating subset) so the client can
  // offer manual swipe navigation across all available photos.
  const items = rotateWindow(photos, photos.length, 45_000);
  res.json(ListPhotosResponse.parse(items));
});

router.get("/events", async (_req, res): Promise<void> => {
  const events = eventItems();
  const items = rotateWindow(events, events.length, 60_000);
  res.json(ListEventsResponse.parse(items));
});

router.get("/weather", async (_req, res): Promise<void> => {
  const weather = await getWeather();
  res.json(GetWeatherResponse.parse(weather));
});

export default router;
