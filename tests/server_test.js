import { assertEquals } from "https://deno.land/std@0.203.0/testing/asserts.ts";
import app from "../app.js";

// -------------------- GET /api/languages --------------------
Deno.test("GET /api/languages", async () => {
    const req = new Request("/api/languages", { method: "GET" });
    const resp = await app.fetch(req);
    const data = await resp.json();
  
    assertEquals(resp.status, 200);
    assertEquals(data.length, 2);
    assertEquals(data[0].name, "Dart");
    assertEquals(data[1].name, "Rust");
});

// -------- GET /api/languages/:id/exercises -------------------
Deno.test("GET /api/languages/1/exercises", async () => {
    const req = new Request("/api/languages/1/exercises", { method: "GET" });
    const resp = await app.fetch(req);
    const data = await resp.json();
  
    assertEquals(resp.status, 200);
    assertEquals(data.length, 1);
    assertEquals(data[0].title, "Hello, World!");
    assertEquals(data[0].description, 'Print "Hello, World!" to the console.');
});

Deno.test("GET /api/languages/2/exercises", async () => {
    const req = new Request("/api/languages/2/exercises", { method: "GET" });
    const resp = await app.fetch(req);
    const data = await resp.json();
  
    assertEquals(resp.status, 200);
    assertEquals(data.length, 1);
    assertEquals(data[0].title, "Hello, World!");
    assertEquals(data[0].description, 'Print "Hello, World!" to the console.');
});