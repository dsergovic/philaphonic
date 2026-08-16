/**
 * Curated Philaphonic content datasets.
 *
 * Each feed endpoint serves a time-rotated window over its dataset so that
 * polling clients continuously see "new" content arriving. The rotation is
 * deterministic per time-slot, so concurrent clients see the same feed.
 */

export interface MusicItem {
  id: string;
  kind: "latest" | "classic";
  artist: string;
  title: string;
  genre: string;
  blurb: string;
  year: number;
  neighborhood: string | null;
  coverUrl: string | null;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  category: string;
  summary: string;
  publishedAt: string;
  url: string | null;
}

export interface SocialPost {
  id: string;
  platform: "instagram" | "x" | "tiktok" | "threads";
  handle: string;
  displayName: string;
  content: string;
  imageUrl: string | null;
  likes: number;
  comments: number;
  postedAt: string;
  tag: string;
}

export interface Photo {
  id: string;
  title: string;
  location: string;
  credit: string;
  imageUrl: string;
  tag: string;
}

export interface EventItem {
  id: string;
  name: string;
  venue: string;
  neighborhood: string;
  date: string;
  timeLabel: string;
  category: string;
  priceLabel: string;
  description: string;
}

export interface TickerItem {
  id: string;
  text: string;
  kind: "nowPlaying" | "pulse" | "fact";
}

/**
 * Returns a rotating window of `count` items over `items`, advancing one
 * position every `slotMs` milliseconds. Deterministic for a given time slot.
 */
export function rotateWindow<T>(items: T[], count: number, slotMs: number): T[] {
  const slot = Math.floor(Date.now() / slotMs);
  const n = items.length;
  const take = Math.min(count, n);
  const out: T[] = [];
  for (let i = 0; i < take; i++) {
    out.push(items[(slot + i) % n]!);
  }
  return out;
}

/** Minutes ago as an ISO timestamp. */
function minsAgo(mins: number): string {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

/** ISO date string `days` days from today (local server time). */
function daysAhead(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// MUSIC — current Philly artists & releases, with classics mixed in
// ---------------------------------------------------------------------------

export const musicItems: MusicItem[] = [
  { id: "m1", kind: "latest", artist: "Mannequin Pussy", title: "I Got Heaven", genre: "Punk / Indie", blurb: "South Philly's loudest tender-hearts, still touring the record that put the city back on punk maps.", year: 2024, neighborhood: "South Philly", coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f3/f3/94/f3f394d0-55c4-b2ec-22f1-d353b1a52923/0045778796861.png/600x600bb.jpg" },
  { id: "m2", kind: "latest", artist: "Tierra Whack", title: "World Wide Whack", genre: "Hip-Hop", blurb: "North Philly's shapeshifter with a full-length as playful and unnerving as anything out of the city in years.", year: 2024, neighborhood: "North Philly", coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/24/da/2a/24da2ae7-74bc-cbec-c371-789c19de8096/23UM1IM64434.rgb.jpg/600x600bb.jpg" },
  { id: "m3", kind: "latest", artist: "Alex G", title: "Headlights", genre: "Indie Rock", blurb: "Havertown's bedroom-pop auteur keeps mutating — warped tape hiss and melodies that won't leave you alone.", year: 2025, neighborhood: "Havertown", coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/df/33/7c/df337c6f-7853-b1f8-8bd0-b4c9737fccc4/196872969757.jpg/600x600bb.jpg" },
  { id: "m4", kind: "classic", artist: "The O'Jays", title: "Back Stabbers", genre: "Philly Soul", blurb: "The Sound of Philadelphia, distilled: Gamble & Huff strings, Sigma Sound sheen, and harmonies for the ages.", year: 1972, neighborhood: "Sigma Sound, Center City", coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/5e/07/f6/5e07f62a-c06e-b23d-5acd-cd36113edb13/dj.lakgldpp.jpg/600x600bb.jpg" },
  { id: "m5", kind: "latest", artist: "Snacktime", title: "Sound Bites", genre: "Brass / Funk", blurb: "The brass band that turned Kelly Drive park hangs into a movement — pure block-party energy.", year: 2024, neighborhood: "Fishtown", coverUrl: null },
  { id: "m6", kind: "latest", artist: "Armand Hammer x The Bul Bey", title: "City Cypher", genre: "Hip-Hop", blurb: "Underground bars over dusty loops — the corner-store cypher tradition is alive and well.", year: 2025, neighborhood: "West Philly", coverUrl: null },
  { id: "m7", kind: "classic", artist: "Hall & Oates", title: "Abandoned Luncheonette", genre: "Blue-Eyed Soul", blurb: "Two Temple kids and the smoothest record ever cut about a diner off Route 724.", year: 1973, neighborhood: "Temple / North Philly", coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/ff/7d/c1/ff7dc1cd-e089-8796-54b8-9a7a8b723318/mzi.krlkfqzk.jpg/600x600bb.jpg" },
  { id: "m8", kind: "latest", artist: "Orion Sun", title: "Orange Skies", genre: "Neo-Soul / R&B", blurb: "Bedroom-soul warmth from a songwriter who makes the city's quiet hours feel cinematic.", year: 2025, neighborhood: "Germantown", coverUrl: null },
  { id: "m9", kind: "latest", artist: "Zahsosaa", title: "Corner Symphony", genre: "Philly Club", blurb: "Sneaker-squeak percussion and relentless BPM — Philly club keeps the dancefloors sweating.", year: 2025, neighborhood: "Southwest Philly", coverUrl: null },
  { id: "m10", kind: "classic", artist: "John Coltrane", title: "Giant Steps", genre: "Jazz", blurb: "Cut two years after he left his Strawberry Mansion rowhouse — the house still stands on 33rd Street.", year: 1960, neighborhood: "Strawberry Mansion", coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/4e/2f/8b/4e2f8b1f-7e14-1ce4-1c76-4683b1b9173d/603497847549.jpg/600x600bb.jpg" },
  { id: "m11", kind: "latest", artist: "Japanese Breakfast", title: "For Melancholy Brunettes", genre: "Indie Pop", blurb: "Michelle Zauner's lush return — written between Seoul and the Philly suburbs that raised her.", year: 2025, neighborhood: "Bryn Mawr", coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9d/01/07/9d0107db-5738-503b-9209-7e7a32738311/50963.jpg/600x600bb.jpg" },
  { id: "m12", kind: "latest", artist: "Ivy Sole", title: "Golden Hour Freestyles", genre: "Hip-Hop / Soul", blurb: "West Philly wordplay with a warm center — Sunday-afternoon rap for row-home porches.", year: 2024, neighborhood: "West Philly", coverUrl: null },
  { id: "m13", kind: "classic", artist: "MFSB", title: "TSOP (The Sound of Philadelphia)", genre: "Philly Soul", blurb: "The house band, the anthem, the whole genre in three letters. Soul Train's theme was born here.", year: 1974, neighborhood: "Sigma Sound, Center City", coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/e2/32/c9/e232c91f-0b85-33a0-43fa-65bce8715ba5/886447237823.jpg/600x600bb.jpg" },
  { id: "m14", kind: "latest", artist: "2nd Grade", title: "Easy Listening Vol. 2", genre: "Power Pop", blurb: "Two-minute pop songs by the dozen — Philly's most reliable hooks-per-minute ratio.", year: 2024, neighborhood: "South Philly", coverUrl: null },
  { id: "m15", kind: "latest", artist: "Sug Daniels", title: "Franklin Delight", genre: "Soul / Folk", blurb: "Honeyed vocals and porch-light storytelling from one of the region's fastest-rising songwriters.", year: 2025, neighborhood: "Wilmington / Philly", coverUrl: null },
  { id: "m16", kind: "classic", artist: "The Roots", title: "Things Fall Apart", genre: "Hip-Hop", blurb: "Before the Tonight Show, there was Illadelph — the record that made organic hip-hop a Philly export.", year: 1999, neighborhood: "South Philly", coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/93/71/d3/9371d36d-3498-2534-fc78-ea209f944c23/06UMGIM02261.rgb.jpg/600x600bb.jpg" },
  { id: "m17", kind: "latest", artist: "Kississippi", title: "Mood Ring Redux", genre: "Indie Pop", blurb: "Glitter-coated heartbreak pop, made for singing alone on the El at midnight.", year: 2024, neighborhood: "Fishtown", coverUrl: null },
  { id: "m18", kind: "classic", artist: "Patti LaBelle", title: "Lady Marmalade", genre: "Soul / Funk", blurb: "The Godmother of Soul, Southwest Philly's own — still the standard for bringing the house down.", year: 1974, neighborhood: "Southwest Philly", coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/28/93/b7/2893b79d-320e-adc5-2be7-cefb5b830042/074643307529.jpg/600x600bb.jpg" },
];

// ---------------------------------------------------------------------------
// NEWS — curated fallback when live RSS aggregation is unavailable
// ---------------------------------------------------------------------------

export function fallbackNews(): NewsItem[] {
  return [
    { id: "n1", headline: "SEPTA weighs late-night El service pilot for summer weekends", source: "The Philadelphia Inquirer", category: "Transit", summary: "Transit officials floated a proposal to run the Market-Frankford Line past 1 a.m. on Fridays and Saturdays, citing nightlife corridor demand.", publishedAt: minsAgo(42), url: null },
    { id: "n2", headline: "Mural Arts unveils its largest wall yet along the Viaduct Rail Park", source: "Billy Penn", category: "Arts", summary: "The five-story piece, painted with neighborhood volunteers over six weeks, celebrates North Philly's jazz lineage.", publishedAt: minsAgo(75), url: null },
    { id: "n3", headline: "Reading Terminal Market adds four new vendors in spring expansion", source: "PhillyVoice", category: "Food", summary: "A Cambodian noodle stall, a South Philly bakery outpost, and two produce vendors join the 130-year-old market hall.", publishedAt: minsAgo(110), url: null },
    { id: "n4", headline: "Eagles announce open practice dates at the Linc for training camp", source: "The Philadelphia Inquirer", category: "Sports", summary: "Fans can catch three free open practices in early August, with select sessions moved to evening slots to beat the heat.", publishedAt: minsAgo(160), url: null },
    { id: "n5", headline: "Schuylkill River Trail extension breaks ground in Grays Ferry", source: "WHYY", category: "City", summary: "The long-awaited connector will close a two-mile gap, linking Center City riders to Bartram's Garden by protected path.", publishedAt: minsAgo(200), url: null },
    { id: "n6", headline: "Philly's community fridges network doubles ahead of summer", source: "Billy Penn", category: "Community", summary: "Volunteers say 24 fridges are now stocked citywide, with new locations in Kensington, Hunting Park, and Cobbs Creek.", publishedAt: minsAgo(240), url: null },
    { id: "n7", headline: "The Wells Fargo Center's replacement arena design gets first public look", source: "PhillyVoice", category: "City", summary: "Renderings show a glass-wrapped bowl with a public concourse — and a heated debate about transit access is already underway.", publishedAt: minsAgo(300), url: null },
    { id: "n8", headline: "Fishtown listed among nation's best neighborhoods for live music", source: "Philadelphia Magazine", category: "Music", summary: "A national ranking cites Johnny Brenda's, Kung Fu Necktie, and a dozen DIY spaces within a 15-minute walk.", publishedAt: minsAgo(360), url: null },
    { id: "n9", headline: "Free summer concert series returns to Dell Music Center", source: "WHYY", category: "Music", summary: "The Strawberry Mansion amphitheater's lineup leans into Philly soul heritage with a tribute night to Gamble & Huff.", publishedAt: minsAgo(420), url: null },
    { id: "n10", headline: "Phillies bullpen shuffle pays off in extra-innings thriller", source: "The Philadelphia Inquirer", category: "Sports", summary: "A four-out save and a walk-off double kept the home stand alive, with the crowd staying loud past midnight.", publishedAt: minsAgo(480), url: null },
    { id: "n11", headline: "Chinatown's night market announces expanded fall dates", source: "Billy Penn", category: "Food", summary: "Organizers say last year's record crowds justified adding two extra nights and a second stage for performances.", publishedAt: minsAgo(540), url: null },
    { id: "n12", headline: "Penn's Landing cap project hits construction milestone", source: "PhillyVoice", category: "City", summary: "Crews finished the first deck section over I-95, the biggest step yet toward reconnecting Old City with the Delaware waterfront.", publishedAt: minsAgo(600), url: null },
  ];
}

// ---------------------------------------------------------------------------
// SOCIAL — Tint-style wall of Philly-tagged posts
// ---------------------------------------------------------------------------

export function socialPosts(): SocialPost[] {
  return [
    { id: "s1", platform: "instagram", handle: "@phillyeatsdaily", displayName: "Philly Eats Daily", content: "Whiz wit at 1am hits different. This city never lets you down. #Philaphonic", imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Philly_Cheesesteak_-_Whiz,_onions_and_peppers.jpg", likes: 2841, comments: 163, postedAt: minsAgo(18), tag: "#PhillyEats" },
    { id: "s2", platform: "x", handle: "@broadstreetbeat", displayName: "Broad Street Beat", content: "The sound of the trolley, a sax player at 15th St station, and someone arguing about the Sixers. That's the whole city in one transfer.", imageUrl: null, likes: 1204, comments: 89, postedAt: minsAgo(35), tag: "#Philly" },
    { id: "s3", platform: "instagram", handle: "@rockystepsclub", displayName: "Rocky Steps Run Club", content: "6am crew earned this view. 72 steps, zero regrets. Every single sunrise is worth it.", imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/956_Running_the_stairs_of_Philadelphia_museum_of_fine_art.jpg", likes: 3390, comments: 214, postedAt: minsAgo(52), tag: "#RockySteps" },
    { id: "s4", platform: "tiktok", handle: "@jawnofalltrades", displayName: "Jawn of All Trades", content: "Ranking every water ice spot in South Philly before the season ends. Part 7: the Italian Market gauntlet.", imageUrl: null, likes: 8752, comments: 641, postedAt: minsAgo(67), tag: "#WaterIce" },
    { id: "s5", platform: "instagram", handle: "@kfnshows", displayName: "KFN Shows", content: "Sold out basement show energy. Fishtown on a Tuesday night goes harder than most cities on a Saturday.", imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/An_audience_Windmill.jpg", likes: 1876, comments: 97, postedAt: minsAgo(84), tag: "#PhillyMusic" },
    { id: "s6", platform: "threads", handle: "@grittyfanacct", displayName: "Definitely Not Gritty", content: "Day 847 of insisting Gritty is the greatest thing this city has produced since the Constitution. The evidence keeps mounting.", imageUrl: null, likes: 4521, comments: 388, postedAt: minsAgo(101), tag: "#Gritty" },
    { id: "s7", platform: "instagram", handle: "@muralmilephl", displayName: "Mural Mile PHL", content: "New wall alert in Brewerytown. The artist spent six weeks on the scaffolding and you can feel every day of it.", imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Bardascino_Park_1000_S_10th_St_Philadelphia_PA_(DSC_3698).jpg", likes: 2233, comments: 118, postedAt: minsAgo(126), tag: "#MuralArts" },
    { id: "s8", platform: "x", handle: "@septaadventures", displayName: "SEPTA Adventures", content: "The Broad Street Line after a Phillies win is the closest thing America has to a carnival on rails.", imageUrl: null, likes: 5107, comments: 292, postedAt: minsAgo(150), tag: "#Phillies" },
    { id: "s9", platform: "tiktok", handle: "@phlparkspots", displayName: "PHL Park Spots", content: "Hidden gem: the Wissahickon at golden hour. 1,800 acres of forest inside city limits and half of you have never been.", imageUrl: null, likes: 6634, comments: 402, postedAt: minsAgo(178), tag: "#Wissahickon" },
    { id: "s10", platform: "instagram", handle: "@southphillybarbell", displayName: "South Philly Barbell", content: "Stoop season is officially open. Bring a folding chair and an opinion about hoagies.", imageUrl: null, likes: 1509, comments: 77, postedAt: minsAgo(205), tag: "#StoopSeason" },
    { id: "s11", platform: "x", handle: "@phillyweatherguy", displayName: "Philly Weather Authority", content: "Perfect rooftop weather for the next 72 hours. If your boss asks, this tweet is a doctor's note.", imageUrl: null, likes: 3218, comments: 145, postedAt: minsAgo(230), tag: "#PhillyWx" },
    { id: "s12", platform: "threads", handle: "@oldcityarts", displayName: "Old City Arts", content: "First Friday tonight. Twenty galleries, one square mile, zero excuses. See you on 2nd Street.", imageUrl: null, likes: 987, comments: 54, postedAt: minsAgo(260), tag: "#FirstFriday" },
  ];
}

// ---------------------------------------------------------------------------
// PHOTOS — regional imagery
// ---------------------------------------------------------------------------

export const photos: Photo[] = [
  { id: "p1", title: "Blue Hour on the Skyline", location: "Schuylkill Banks", credit: "Wikimedia Commons / Kevin Burkett", imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Philadelphia_Skyline_at_Dusk.jpg", tag: "skyline" },
  { id: "p2", title: "Boathouse Row Lights", location: "Kelly Drive", credit: "Wikimedia Commons / MBob", imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Boathouse_Row_at_night.JPG", tag: "landmarks" },
  { id: "p3", title: "Six Stories of Color", location: "South Philadelphia", credit: "Wikimedia Commons / Beyond My Ken", imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Isaiah_Zagar_mural_1016_South_Street_Philadelphia.jpg", tag: "murals" },
  { id: "p4", title: "Ninth Street Morning", location: "Italian Market", credit: "Wikimedia Commons / Derek Ramsey", imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Italian_Market_Vegetable_Stand_3000px.jpg", tag: "food" },
  { id: "p5", title: "America's Oldest Street", location: "Elfreth's Alley, Old City", credit: "Wikimedia Commons / Sam Nabi", imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Elfreth's_Alley_streetscape.jpg", tag: "history" },
  { id: "p6", title: "October in the Park", location: "Fairmount Park", credit: "Wikimedia Commons / Michael Jastremski", imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Autumn_trees_Belmont_Plateau_Philadelphia.jpg", tag: "nature" },
  { id: "p7", title: "Lunch Rush", location: "Reading Terminal Market", credit: "Wikimedia Commons / ajay_suresh", imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Reading_Terminal_Market_(53587020195).jpg", tag: "food" },
  { id: "p8", title: "Midnight Green Sea", location: "Lincoln Financial Field", credit: "Wikimedia Commons / Patriarca12", imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/2019_NHL_Stadium_Series_at_Lincoln_Financial_Field_in_Philadelphia.jpg", tag: "sports" },
];

// ---------------------------------------------------------------------------
// EVENTS — upcoming happenings, dates always relative to today
// ---------------------------------------------------------------------------

export function eventItems(): EventItem[] {
  return [
    { id: "e1", name: "Roots Picnic Warm-Up Session", venue: "The Fillmore", neighborhood: "Fishtown", date: daysAhead(1), timeLabel: "8:00 PM", category: "Music", priceLabel: "$35+", description: "Local openers and surprise guests kick off festival week with a hometown showcase." },
    { id: "e2", name: "First Friday Gallery Crawl", venue: "Old City Arts District", neighborhood: "Old City", date: daysAhead(2), timeLabel: "5:00 PM", category: "Arts", priceLabel: "Free", description: "Twenty-plus galleries open late with new exhibitions, street performers, and pop-up vendors." },
    { id: "e3", name: "Night Market: Kensington Ave", venue: "Kensington & Lehigh", neighborhood: "Kensington", date: daysAhead(3), timeLabel: "6:00 PM", category: "Food", priceLabel: "Free entry", description: "Sixty food vendors, two stages, and the city's best people-watching under the El." },
    { id: "e4", name: "Phillies vs. Mets", venue: "Citizens Bank Park", neighborhood: "South Philly", date: daysAhead(4), timeLabel: "6:40 PM", category: "Sports", priceLabel: "$20+", description: "Division rivalry under the lights. Dollar dog night is back, for better or worse." },
    { id: "e5", name: "Jazz on the Parkway", venue: "Dell Music Center", neighborhood: "Strawberry Mansion", date: daysAhead(5), timeLabel: "7:30 PM", category: "Music", priceLabel: "Free", description: "The free summer series continues with a tribute to the Philly organ-trio tradition." },
    { id: "e6", name: "Wissahickon Sunrise Hike", venue: "Valley Green Inn Trailhead", neighborhood: "Northwest Philly", date: daysAhead(6), timeLabel: "6:15 AM", category: "Outdoors", priceLabel: "Free", description: "Guided five-miler through the gorge, ending with coffee on the Valley Green porch." },
    { id: "e7", name: "South Street Spring Festival", venue: "South Street Headhouse District", neighborhood: "Queen Village", date: daysAhead(8), timeLabel: "12:00 PM", category: "Festival", priceLabel: "Free", description: "Fifteen blocks, six stages, 200 vendors — the unofficial start of Philly festival season." },
    { id: "e8", name: "Open Mic at World Cafe Live", venue: "World Cafe Live", neighborhood: "University City", date: daysAhead(9), timeLabel: "7:00 PM", category: "Music", priceLabel: "$5", description: "The long-running Monday night proving ground for the city's next wave of songwriters." },
    { id: "e9", name: "Italian Market Festival", venue: "9th Street", neighborhood: "Bella Vista", date: daysAhead(11), timeLabel: "11:00 AM", category: "Food", priceLabel: "Free", description: "Two days of grease-pole climbing, procession bands, and the best sandwiches in America." },
    { id: "e10", name: "Bike the Boulevard", venue: "Roosevelt Boulevard", neighborhood: "Northeast Philly", date: daysAhead(13), timeLabel: "9:00 AM", category: "Outdoors", priceLabel: "Free", description: "Twelve car-free miles of the Boulevard, open to bikes, skates, and strollers for one morning." },
  ];
}

// ---------------------------------------------------------------------------
// TICKER — short rotating one-liners
// ---------------------------------------------------------------------------

export const tickerItems: TickerItem[] = [
  { id: "t1", text: "NOW SPINNING: Tierra Whack — World Wide Whack", kind: "nowPlaying" },
  { id: "t2", text: "The Singing Fountain in East Passyunk is, in fact, singing right now", kind: "pulse" },
  { id: "t3", text: "Philadelphia has more public art than any other American city", kind: "fact" },
  { id: "t4", text: "NOW SPINNING: MFSB — TSOP (The Sound of Philadelphia)", kind: "nowPlaying" },
  { id: "t5", text: "El running on time. Yes, really. Screenshot this.", kind: "pulse" },
  { id: "t6", text: "The Mural Arts Program has painted over 4,000 walls since 1984", kind: "fact" },
  { id: "t7", text: "NOW SPINNING: Alex G — Headlights", kind: "nowPlaying" },
  { id: "t8", text: "Stoop season status: ACTIVE across all neighborhoods", kind: "pulse" },
  { id: "t9", text: "John Coltrane's rowhouse still stands on N. 33rd Street in Strawberry Mansion", kind: "fact" },
  { id: "t10", text: "NOW SPINNING: Orion Sun — Orange Skies", kind: "nowPlaying" },
  { id: "t11", text: "Rittenhouse Square pianist has drawn a crowd of forty and counting", kind: "pulse" },
  { id: "t12", text: "The Reading Terminal Market has operated continuously since 1893", kind: "fact" },
  { id: "t13", text: "NOW SPINNING: Snacktime — Sound Bites", kind: "nowPlaying" },
  { id: "t14", text: "Wawa coffee line moving briskly. Civic morale: high.", kind: "pulse" },
  { id: "t15", text: "Elfreth's Alley is the oldest continuously inhabited street in America", kind: "fact" },
  { id: "t16", text: "NOW SPINNING: The Roots — Things Fall Apart", kind: "nowPlaying" },
  { id: "t17", text: "Someone is absolutely shredding the Paine's Park quarter pipe right now", kind: "pulse" },
  { id: "t18", text: "Philly invented the cheesesteak in 1930 at a hot dog stand on 9th Street", kind: "fact" },
];
