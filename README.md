# Philaphonic

A single-page, always-on "live experience of all things Philly" — dark mode only, with self-updating panels for music, news, social chatter, regional photos, upcoming events, and a live ticker. No search, no settings, no users; the home page is the entire product.

Live at [philaphonic.com](https://philaphonic.com).

## Workspace layout

This is a pnpm monorepo (Node.js 24, TypeScript 5.9):

| Package | Path | Purpose |
| --- | --- | --- |
| `@workspace/philaphonic` | `artifacts/philaphonic` | React + Vite frontend (Tailwind, framer-motion, TanStack Query, wouter) |
| `@workspace/api-server` | `artifacts/api-server` | Express 5 API serving the six feed endpoints |
| `@workspace/mockup-sandbox` | `artifacts/mockup-sandbox` | Isolated component preview sandbox (design tooling) |
| `@workspace/api-spec` | `lib/api-spec` | OpenAPI contract (`openapi.yaml`) + Orval codegen |
| `@workspace/api-zod` | `lib/api-zod` | Generated Zod schemas for API validation |
| `@workspace/api-client-react` | `lib/api-client-react` | Generated TanStack Query hooks |
| `@workspace/db` | `lib/db` | Drizzle scaffolding (currently unused — no database) |

## Getting started

```sh
pnpm install

# Run the API server (reads PORT, defaults per artifact config)
pnpm --filter @workspace/api-server run dev

# Run the frontend
pnpm --filter @workspace/philaphonic run dev
```

Other useful commands:

```sh
pnpm run typecheck                                  # typecheck all packages
pnpm run build                                      # typecheck + build all packages
pnpm --filter @workspace/api-spec run codegen       # regenerate hooks/schemas from openapi.yaml
```

## Architecture

- **API contract first** — `lib/api-spec/openapi.yaml` is the source of truth for GET `/api/{music,news,social,photos,events,ticker}`; Orval generates the Zod schemas and React Query hooks.
- **No database** — feeds are curated in-server datasets rotated deterministically per time slot (`rotateWindow` in `artifacts/api-server/src/lib/phillyData.ts`), so all clients see the same "live" feed.
- **News is the only live feed** — RSS aggregation across WHYY, Billy Penn, PhillyVoice, and Philly Mag with a 5-minute in-memory cache and curated fallback (`artifacts/api-server/src/lib/newsFetcher.ts`).
- **Frontend** — one bento-grid page (`artifacts/philaphonic/src/pages/home.tsx`); panels poll with staggered intervals (20–60s) and animate item turnover with framer-motion.

See `replit.md` for operational details and development gotchas.
