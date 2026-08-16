// Vercel serverless entry point. Vercel maps this file to the `/api` route;
// `vercel.json` rewrites all `/api/*` requests here while preserving the
// original path, which the Express app then routes internally.
import app from "../artifacts/api-server/dist/serverless.mjs";

export default function handler(req, res) {
  return app(req, res);
}
