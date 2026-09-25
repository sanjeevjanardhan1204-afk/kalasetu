import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "../server";

// Vercel serverless entrypoint. A file under api/ becomes its own function; this one is mapped
// to every /api/* request (see vercel.json rewrites) and simply hands the request to the same
// Express app used by the standalone server, without ever calling app.listen().
const appPromise = createApp();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await appPromise;
  app(req as any, res as any);
}
