import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import postgres from "postgres";
import { Redis } from "ioredis";

const app = new Hono();
const sql = postgres();
let redis;
let consumeEnabled = false;

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

// Step 3

app.get(
  "/api/status",
  async(c) => {
    try {
      const queueSize = await redis.llen("submissions");
      return c.json({"queue_size":queueSize, "consume_enabled": consumeEnabled});
    } catch (err) {
      console.error("Error fetching submission:", err);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
)

app.post(
  "/api/consume/enable",
  async(c) => {
    consumeEnabled = true;
    return c.json({"consume_enabled": consumeEnabled})
  }
)

app.post(
  "/api/consume/disable",
  async(c) => {
    consumeEnabled = false;
    return c.json({"consume_enabled": consumeEnabled})
  }
)

async function grading() {
  while(true) {
    if (!consumeEnabled) {
      await new Promise((res) => setTimeout(res, 250));
      continue;
    }

    const submissionId = await redis.rpop("submissions");

    try {
      await sql`UPDATE exercise_submissions SET grading_status = 'processing' WHERE id = ${submissionId}`
      
      const delay = Math.floor(Math.random() * 2000) + 1000;
      await new Promise((res) => setTimeout(res, delay));

      const grade = Math.floor(Math.random() * 101);
      await sql`UPDATE exercise_submissions SET grading_status = 'graded' WHERE id = ${submissionId}`
      await sql`UPDATE exercise_submissions SET grade = ${grade} WHERE id = ${submissionId}`
    } catch (err) {
      console.error("Error grading submission:", err);
    }
  }
}

grading();

export default app;