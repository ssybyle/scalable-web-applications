import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import postgres from "postgres";
import { Redis } from "ioredis";

const app = new Hono();
const sql = postgres();
const cache = new Map();
let redis;

if (Deno.env.get("REDIS_HOST")) {
  redis = new Redis(
    Number.parseInt(Deno.env.get("REDIS_PORT")),
    Deno.env.get("REDIS_HOST"),
  );
} else {
  redis = new Redis(6379, "redis");
}

app.use("/*", cors());
app.use("/*", logger());

const cacheMiddleware = async (c, next) => {
  const key = c.req.url;
  if (cache.has(key)) {
    return c.json(cache.get(key));
  }

  await next();

  if (c.res.ok && c.res.headers.get("content-type")?.includes("application/json")) {
    const cloned = c.res.clone();
    const data = await cloned.json();
    cache.set(key, data);
  }
};

// Step 1

app.get(
    "/api/languages", cacheMiddleware,
    async function getLanguages(c) {
        try {
            const result = await sql`SELECT * FROM languages`;
            return c.json(result);
          } catch (err) {
            console.error("Database error:", err);
            return c.text("Internal Server Error", 500);
        }
    }
);

app.get(
    "/api/languages/:id/exercises", cacheMiddleware,
    async (c) => {
        const language = c.req.param("id");
        const result = await sql`SELECT id, title, description FROM exercises WHERE exercises.language_id = ${language}`;

        return c.json(result);
    }
);

// Step 2

app.post(
  "/api/exercises/:id/submissions",
  async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();

      if (!body.source_code) {
        return c.json({ error: "source_code is required" }, 400);
      }

      const [submission] = await sql`
        INSERT INTO exercise_submissions (exercise_id, source_code)
        VALUES (${id}, ${body.source_code})
        RETURNING id
      `;

      await redis.lpush("submissions", submission.id.toString());

      return c.json({ id: submission.id });
    } catch (err) {
      console.error("Error creating submission:", err);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
);

export default app;