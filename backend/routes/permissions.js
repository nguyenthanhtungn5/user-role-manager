import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { query as db } from "../db/db.js";

const router = Router();

router.post(
  "/",
  body("name").isString().trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { rows } = await db(
        "INSERT INTO permissions(name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING *",
        [req.body.name]
      );
      if (!rows.length) {
        return res.status(200).json({ message: "Permission already exists" });
      }
      res.status(201).json(rows[0]);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal error" });
    }
  }
);

router.delete("/:id", param("id").isInt(), async (req, res) => {
  const { rowCount } = await db("DELETE FROM permissions WHERE id=$1", [
    req.params.id,
  ]);
  if (!rowCount) {
    return res.status(404).json({ message: "Permission not found" });
  }
  res.status(204).send();
});

router.get("/", async (_req, res) => {
  const { rows } = await db("SELECT * FROM permissions ORDER BY id DESC");
  res.json(rows);
});

export default router;
