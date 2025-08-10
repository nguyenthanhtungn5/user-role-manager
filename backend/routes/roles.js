import { Router } from "express";
import { query as dbQuery } from "../db/db.js";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";

const router = Router();

// GET /api/roles
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT id, name FROM roles`;
    const { rows } = await dbQuery(sql);
    res.status(200).json(rows);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

// POST /api/roles  { name }
router.post(
  "/",
  body("name").isString().trim().notEmpty(),
  validate,
  async (req, res) => {
    const { name } = req.body;
    const sql = `INSERT INTO roles(name) VALUES ($1) RETURNING *`;
    const params = [name];
    try {
      const { rows } = await dbQuery(sql, params);
      res.status(201).json(rows[0]);
    } catch (e) {
      return res
        .status(e.code === "23505" ? 409 : 500)
        .json({ message: e.message });
    }
  }
);

// POST /api/roles/:id/assign-role
router.post(
  "/:id/assign-role",
  body("roleIds").isArray(),
  validate,
  async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { roleIds } = req.body;

    try {
      // Check if user exists
      const userCheckResult = await dbQuery(
        `SELECT id FROM users WHERE id = $1`,
        [userId]
      );
      if (userCheckResult.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      // Assign role, if error ocurrs, rollback all sql command
      await dbQuery("BEGIN");
      for (const currentId of roleIds) {
        await dbQuery(
          `INSERT INTO user_roles(user_id, role_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`, // is not a error and not create duplicate
          [userId, currentId]
        );
      }
      await dbQuery("COMMIT");
      return res.status(201).json({
        message: "Rolle(n) zugewiesen",
        userId: userId,
        roleIds: roleIds,
      });
    } catch (e) {
      await db("ROLLBACK");
      return res.status(500).json({ message: e.message });
    }
  }
);

export default router;
