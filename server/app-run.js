import app from "./app.js";

Deno.serve({ port: 8000 }, app.fetch);