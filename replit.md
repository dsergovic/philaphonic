# Philaphonic

A single-page, always-on "live experience of all things Philly" — dark mode only, with auto-rotating panels for music, news, social chatter, regional photos, and upcoming events. No search, no settings, no users; home page only.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/philaphonic run dev` — run the Philaphonic frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (pino logging via `req.log`)
- Frontend: React + Vite, Tailwind, framer-motion, TanStack Query (polling), wouter
- Validation: Zod, API codegen via Orval (from OpenAPI spec)
- No database — feeds are curated in-server datasets

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth): GET `/api/{music,news,social,photos,events,weather}`
- `artifacts/api-server/src/lib/phillyData.ts` — curated datasets + `rotateWindow` time-slot rotation
- `artifacts/api-server/src/lib/newsFetcher.ts` — live RSS aggregation (Billy Penn, PhillyVoice, WHYY, Philly Mag) with 5-min cache and curated fallback
- `artifacts/api-server/src/routes/feeds.ts` — the six feed routes, responses validated with `@workspace/api-zod`
- `artifacts/philaphonic/src/pages/home.tsx` — bento grid layout; panels in `src/components/*-panel.tsx`
- `artifacts/philaphonic/public/images/{photos,covers,social}/` — AI-generated imagery referenced by seed data as site-root-relative paths

## Architecture decisions

- No database: content is curated in-server and rotated deterministically per time slot (`rotateWindow`), so polling clients continuously see fresh items and concurrent clients see the same feed.
- News is the only live feed — RSS aggregation with in-memory cache; on failure it silently falls back to the curated dataset (fallback logged via `req.log`).
- Frontend panels poll with staggered `refetchInterval` (20–60s) and animate item turnover with framer-motion `AnimatePresence`.
- Event dates are generated relative to "today" so the events panel always looks upcoming.

## Product

One dark-mode page: photo hero (rotating regional photography), events list, Tint-style social wall, latest-music panel (with Philly classics mixed in), cross-publication news feed, and a footer with the date, time, and current Philadelphia weather. Everything updates on its own; every item is a real link out.

## User preferences

- No search, settings, users, or help pages — the home page is the entire product.
- Dark mode only; panels should auto-scroll or fade as new content arrives.

## Gotchas

- Orval emits zod-v4 `z.int()` for OpenAPI `type: integer`, which breaks against the workspace zod version — use `type: number` in `openapi.yaml` instead.
- Generated hooks require an explicit `queryKey` when passing custom query options (e.g. `refetchInterval`); use the exported `getList*QueryKey()` helpers.
- Social seed data already includes `@`/`#` prefixes — don't re-prefix in the UI.
