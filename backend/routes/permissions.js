import { Router } from "express";
import { body, param } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { pool } from "../db/db.js";

const router = Router();

// GET /api/permissions
router.get("/", async (_req, res) => {
  const sql = "SELECT * FROM permissions ORDER BY id DESC";
  const client = await pool.connect();

  try {
    const { rows } = await client.query(sql);
    res.status(200).json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  } finally {
    client.release();
  }
});

// POST /api/permissions { name }
router.post(
  "/",
  body("name").isString().trim().notEmpty(),
  validate,
  async (req, res) => {
    const sql = "INSERT INTO permissions(name) VALUES ($1)";
    const client = await pool.connect();

    try {
      const { rows } = await client.query(sql, [req.body.name]);
      res.status(201).json(rows[0]);
    } catch (e) {
      res.status(500).json({ message: e.message });
    } finally {
      client.release();
    }
  }
);

// DELETE /api/permissions/:id
router.delete("/:id", param("id").isInt(), validate, async (req, res) => {
  const sql = "DELETE FROM permissions WHERE id = $1";
  const client = await pool.connect();

  try {
    const id = parseInt(req.params.id, 10);
    await client.query(sql, [id]);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: e.message });
  } finally {
    client.release();
  }
});

export default router;
