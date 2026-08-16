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
  const items = rotateWindow(musicItems, 8, 25_000);
  res.json(ListMusicResponse.parse(items));
});

router.get("/news", async (req, res): Promise<void> => {
  const live = await getLiveNews();
  if (live) {
    res.json(ListNewsResponse.parse(rotateWindow(live, 10, 40_000)));
    return;
  }
  req.log.info("Serving curated news fallback");
  res.json(ListNewsResponse.parse(rotateWindow(fallbackNews(), 10, 40_000)));
});

router.get("/social", async (_req, res): Promise<void> => {
  const items = rotateWindow(socialPosts(), 8, 30_000);
  res.json(ListSocialResponse.parse(items));
});

router.get("/photos", async (_req, res): Promise<void> => {
  const items = rotateWindow(photos, 6, 45_000);
  res.json(ListPhotosResponse.parse(items));
});

router.get("/events", async (_req, res): Promise<void> => {
  const items = rotateWindow(eventItems(), 7, 60_000);
  res.json(ListEventsResponse.parse(items));
});

router.get("/weather", async (_req, res): Promise<void> => {
  const weather = await getWeather();
  res.json(GetWeatherResponse.parse(weather));
});

export default router;
