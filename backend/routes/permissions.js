import { Router } from "express";
import { body, param } from "express-validator";
import { query as db } from "../db/db.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

// GET /api/permissions
router.get("/", async (_req, res) => {
  try {
    const { rows } = await db("SELECT * FROM permissions ORDER BY id DESC");
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
    try {
      const { rows } = await db("INSERT INTO permissions(name) VALUES ($1)", [
        req.body.name,
      ]);
      res.status(201).json(rows[0]);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

// DELETE /api/permissions/:id
router.delete("/:id", param("id").isInt(), validate, async (req, res) => {
  try {
    const { rows } = await db("DELETE FROM permissions WHERE id=$1", [
      req.params.id,
    ]);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
