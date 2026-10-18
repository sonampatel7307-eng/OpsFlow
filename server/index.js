const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 5000;

// Tests can use a separate database via DB_PATH.
const dbPath = process.env.DB_PATH || path.join(__dirname, "tasks.db");
const db = new Database(dbPath);

app.use(cors());
app.use(express.json());

// Backend health check
app.get("/", (req, res) => {
  res.send("OpsFlow backend is running");
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
  try {
    const tasks = db
      .prepare("SELECT * FROM tasks ORDER BY id DESC")
      .all();

    res.json(tasks);
  } catch {
    res.status(500).json({ error: "Unable to fetch tasks" });
  }
});

// Create a task
app.post("/api/tasks", (req, res) => {
  const {
    title,
    project = "Operations",
    priority = "Medium",
    assignee = "Sonam Patel",
  } = req.body || {};

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Task title is required" });
  }

  if (
    typeof project !== "string" ||
    !project.trim() ||
    typeof assignee !== "string"
  ) {
    return res.status(400).json({ error: "Invalid project or assignee" });
  }

  const allowedPriorities = ["Low", "Medium", "High"];

  if (!allowedPriorities.includes(priority)) {
    return res.status(400).json({ error: "Invalid priority" });
  }

  try {
    const result = db
      .prepare(`
        INSERT INTO tasks
          (title, completed, project, priority, assignee, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(
        title.trim(),
        0,
        project.trim(),
        priority,
        assignee.trim() || "Sonam Patel",
        "Open"
      );

    const task = db
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(result.lastInsertRowid);

    return res.status(201).json(task);
  } catch {
    return res.status(500).json({ error: "Unable to create task" });
  }
});

// Update task status
app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const { status, completed } = req.body || {};

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  let newStatus;

  if (typeof status === "string") {
    const allowedStatuses = ["Open", "In Progress", "Resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    newStatus = status;
  } else if (typeof completed === "boolean") {
    newStatus = completed ? "Resolved" : "Open";
  } else {
    return res.status(400).json({
      error: "Provide a valid status or completed boolean",
    });
  }

  try {
    // Check existence separately: unchanged updates are still valid.
    const existing = db
      .prepare("SELECT id FROM tasks WHERE id = ?")
      .get(id);

    if (!existing) {
      return res.status(404).json({ error: "Task not found" });
    }

    const isCompleted = newStatus === "Resolved" ? 1 : 0;

    db.prepare(`
      UPDATE tasks
      SET status = ?, completed = ?
      WHERE id = ?
    `).run(newStatus, isCompleted, id);

    const task = db
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(id);

    return res.json(task);
  } catch {
    return res.status(500).json({ error: "Unable to update task" });
  }
});

// Only start listening when this file is run directly.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = { app, db };