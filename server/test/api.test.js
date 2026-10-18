
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const Database = require("better-sqlite3");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "opsflow-test-"));
const testDbPath = path.join(tempDir, "test.db");

const setupDb = new Database(testDbPath);

setupDb.exec(`
  CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    project TEXT NOT NULL DEFAULT 'Operations',
    priority TEXT NOT NULL DEFAULT 'Medium',
    assignee TEXT NOT NULL DEFAULT 'Sonam Patel',
    status TEXT NOT NULL DEFAULT 'Open'
  );
`);

setupDb.close();
process.env.DB_PATH = testDbPath;

const { app, db } = require("../index");

after(() => {
  db.close();
  delete process.env.DB_PATH;
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("health endpoint responds successfully", async () => {
  const response = await request(app).get("/");
  assert.equal(response.status, 200);
  assert.match(response.text, /OpsFlow backend is running/);
});

test("rejects a missing task title", async () => {
  const response = await request(app)
    .post("/api/tasks")
    .send({ title: "   " });

  assert.equal(response.status, 400);
});

test("rejects an invalid priority", async () => {
  const response = await request(app)
    .post("/api/tasks")
    .send({ title: "Test task", priority: "Urgent" });

  assert.equal(response.status, 400);
});

test("creates a task and trims its title", async () => {
  const response = await request(app)
    .post("/api/tasks")
    .send({ title: "  Check equipment  ", priority: "High" });

  assert.equal(response.status, 201);
  assert.equal(response.body.title, "Check equipment");
  assert.equal(response.body.priority, "High");
  assert.equal(response.body.status, "Open");
});

test("rejects an invalid task status", async () => {
  const created = await request(app)
    .post("/api/tasks")
    .send({ title: "Status test" });

  const response = await request(app)
    .patch(`/api/tasks/${created.body.id}`)
    .send({ status: "Cancelled" });

  assert.equal(response.status, 400);
});

test("rejects an invalid task ID", async () => {
  const response = await request(app)
    .patch("/api/tasks/abc")
    .send({ status: "Resolved" });

  assert.equal(response.status, 400);
});

test("returns 404 for a task that does not exist", async () => {
  const response = await request(app)
    .patch("/api/tasks/9999")
    .send({ status: "Resolved" });

  assert.equal(response.status, 404);
});

test("resolves an existing task and marks it completed", async () => {
  const created = await request(app)
    .post("/api/tasks")
    .send({ title: "Resolve this task" });

  const response = await request(app)
    .patch(`/api/tasks/${created.body.id}`)
    .send({ status: "Resolved" });

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "Resolved");
  assert.equal(response.body.completed, 1);
});
