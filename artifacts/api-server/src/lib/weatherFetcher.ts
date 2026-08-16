/**
 * Current Philadelphia weather via Open-Meteo (no API key required).
 * Cached in memory; returns null on failure so callers can omit weather
 * from the response rather than error.
 */
import { logger } from "./logger";

const PHILA_LAT = 39.9526;
const PHILA_LON = -75.1652;
const FORECAST_URL = `https://api.open-meteo.com/v1/forecast?latitude=${PHILA_LAT}&longitude=${PHILA_LON}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FNew_York`;

const CACHE_TTL_MS = 15 * 60_000;
const FETCH_TIMEOUT_MS = 5_000;

export interface WeatherInfo {
  tempF: number;
  condition: string;
  updatedAt: string;
}

// WMO weather codes, per Open-Meteo's docs.
const WMO_CONDITIONS: Record<number, string> = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Showers",
  82: "Heavy showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorms",
  96: "Thunderstorms w/ hail",
  99: "Thunderstorms w/ hail",
};

let cache: { info: WeatherInfo; fetchedAt: number } | null = null;
let inFlight: Promise<WeatherInfo | null> | null = null;

async function fetchWeather(): Promise<WeatherInfo | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(FORECAST_URL, { signal: controller.signal });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      current?: { temperature_2m?: number; weather_code?: number };
    };
    const tempF = data.current?.temperature_2m;
    const code = data.current?.weather_code;
    if (typeof tempF !== "number" || typeof code !== "number") return null;
    return {
      tempF: Math.round(tempF),
      condition: WMO_CONDITIONS[code] ?? "Unknown",
      updatedAt: new Date().toISOString(),
    };
  } catch (err) {
    logger.warn({ err: String(err) }, "Weather fetch failed");
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function getWeather(): Promise<WeatherInfo | null> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.info;
  }
  if (!inFlight) {
    inFlight = fetchWeather()
      .then((info) => {
        if (info) cache = { info, fetchedAt: Date.now() };
        return info;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  const fresh = await inFlight;
  if (!fresh && cache) return cache.info;
  return fresh;
}
