import { Router } from "express";
import { body, param } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { simpleRequestDBHelper } from "../db/db.js";

const router = Router();

// GET /api/permissions
router.get("/", async (_req, res) => {
  const sql = "SELECT * FROM permissions ORDER BY id DESC";

  await simpleRequestDBHelper(res, async (client) => {
    const { rows } = await client.query(sql);
    res.status(200).json(rows);
  });
});

// POST /api/permissions { name }
router.post(
  "/",
  body("name").isString().trim().notEmpty(),
  validate,
  async (req, res) => {
    const sql = "INSERT INTO permissions(name) VALUES ($1)";
    await simpleRequestDBHelper(res, async (client) => {
      const { rows } = await client.query(sql, [req.body.name]);
      res.status(200).json(rows[0]);
    });
  }
);

// DELETE /api/permissions/:id
router.delete("/:id", param("id").isInt(), validate, async (req, res) => {
  const sql = "DELETE FROM permissions WHERE id = $1";
  const id = parseInt(req.params.id, 10);

  await simpleRequestDBHelper(res, async (client) => {
    const { rows } = await client.query(sql, [id]);
    res.status(200).json(rows[0]);
  });
});

export default router;
