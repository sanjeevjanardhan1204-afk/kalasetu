// Production fallback entry point for container runners that execute `node server.js`
process.env.NODE_ENV = "production";
await import("./dist/server.cjs");


