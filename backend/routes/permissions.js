import { Router } from "express";
import { body, param } from "express-validator";
import { query as dbQuery } from "../db/db.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

// GET /api/permissions
router.get("/", async (_req, res) => {
  const sql = "SELECT * FROM permissions ORDER BY id DESC";

  try {
    const { rows } = await dbQuery(sql);
    res.status(200).json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST /api/permissions { name }
router.post(
  "/",
  body("name").isString().trim().notEmpty(),
  validate,
  async (req, res) => {
    const sql = "INSERT INTO permissions(name) VALUES ($1)";

    try {
      const { rows } = await dbQuery(sql, [req.body.name]);
      res.status(201).json(rows[0]);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

// DELETE /api/permissions/:id
router.delete("/:id", param("id").isInt(), validate, async (req, res) => {
  const sql = "DELETE FROM permissions WHERE id = $1";

  try {
    const id = parseInt(req.params.id, 10);
    await dbQuery(sql, [id]);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: e.message });
  } finally {
    client.release();
  }
});

export default router;
