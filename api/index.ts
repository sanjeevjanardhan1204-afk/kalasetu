import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "../server";

// Vercel serverless entrypoint. A file under api/ becomes its own function; this one is mapped
// to every /api/* request (see vercel.json rewrites) and simply hands the request to the same
// Express app used by the standalone server, without ever calling app.listen().
const appPromise = createApp();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const app = await appPromise;
    app(req as any, res as any);
  } catch (err: any) {
    // Surface the real error instead of Vercel's opaque FUNCTION_INVOCATION_FAILED page,
    // so a future startup failure is diagnosable from the response body alone.
    console.error('[api] createApp() failed:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Server failed to start', detail: err?.message || String(err) }));
  }
}
