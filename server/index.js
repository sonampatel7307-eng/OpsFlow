
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = 5000;

const db = new Database("tasks.db");

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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new task
app.post("/api/tasks", (req, res) => {
  const {
    title,
    project = "Operations",
    priority = "Medium",
    assignee = "Sonam Patel",
  } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "Task title is required",
    });
  }

  const allowedPriorities = ["Low", "Medium", "High"];

  if (!allowedPriorities.includes(priority)) {
    return res.status(400).json({
      error: "Invalid priority",
    });
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
        project,
        priority,
        typeof assignee === "string" && assignee.trim()
          ? assignee.trim()
          : "Sonam Patel",
        "Open"
      );

    const task = db
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task status
app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const { status, completed } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid task ID",
    });
  }

  let newStatus;

  if (typeof status === "string") {
    const allowedStatuses = ["Open", "In Progress", "Resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
      });
    }

    newStatus = status;
  } else if (typeof completed === "boolean") {
    newStatus = completed ? "Resolved" : "Open";
  } else {
    return res.status(400).json({
      error: "Provide a valid status or completed boolean",
    });
  }

  const isCompleted = newStatus === "Resolved" ? 1 : 0;

  try {
    const result = db
      .prepare(`
        UPDATE tasks
        SET status = ?, completed = ?
        WHERE id = ?
      `)
      .run(newStatus, isCompleted, id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    const task = db
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(id);

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
