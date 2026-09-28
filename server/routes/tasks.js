const express = require("express");
const pool = require("../db/pool");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

// GET /api/tasks - list all tasks for the logged-in user
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, c.name AS category_name
       FROM tasks t
       LEFT JOIN categories c ON c.id = t.category_id
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// GET /api/tasks/categories - list categories for dropdowns
router.get("/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// POST /api/tasks - create a task
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, category_id, due_date } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });

    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, priority, category_id, due_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.userId, title, description || null, priority || "medium", category_id || null, due_date || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT /api/tasks/:id - update a task (title, status, priority, etc.)
router.put("/:id", async (req, res) => {
  try {
    const { title, description, priority, status, category_id, due_date } = req.body;
    const result = await pool.query(
      `UPDATE tasks SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         priority = COALESCE($3, priority),
         status = COALESCE($4, status),
         category_id = COALESCE($5, category_id),
         due_date = COALESCE($6, due_date)
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [title, description, priority, status, category_id, due_date, req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted", id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
