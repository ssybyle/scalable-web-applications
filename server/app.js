import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import postgres from "postgres";

const app = new Hono();
const sql = postgres();

app.use("/*", cors());
app.use("/*", logger());

app.get(
    "/languages",
    async (c) => {
        const result = await sql`SELECT * FROM languages`;

        return c.json({result});
    }
);

app.get(
    "/languages.:id/exercises",
    async (c) => {
        const id = c.req.param("id");

        return c.json({result});
    }
);

export default app;