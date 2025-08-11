import { Router } from "express";
import { body } from "express-validator";
import { query as db } from "../db/db.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

// GET /api/assign/user-roles
router.get("/user-roles", async (req, res) => {
  try {
    const { rows } = await db(
      `SELECT user_id AS userId, role_id AS roleId FROM user_roles`
    );
    res.status(200).send(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST /api/assign/user-roles  { userId, roleIds: [] }
router.post(
  "/user-roles",
  body("userId").isInt(),
  body("roleIds").isArray({ min: 1 }),
  body("roleIds.*").isInt(),
  validate,
  async (req, res) => {
    const { userId, roleIds } = req.body;

    try {
      await db("BEGIN");
      for (const roleId of roleIds) {
        await db(
          `INSERT INTO user_roles(user_id, role_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [userId, roleId]
        );
      }
      await db("COMMIT");
      res.status(200).send();
    } catch (e) {
      await db("ROLLBACK");
      res.status(500).json({ message: e.message });
    }
  }
);

// GET /api/assign/user-roles
router.get("/role-permissions", async (req, res) => {
  try {
    const { rows } = await db(
      `SELECT role_id AS roleId, permission_id AS permissionId FROM role_permissions`
    );
    res.status(200).send(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST /api/assign/role-permissions  { roleId, permissionIds: [] }
router.post(
  "/role-permissions",
  body("roleId").isInt(),
  body("permissionIds").isArray({ min: 1 }),
  body("permissionIds.*").isInt(),
  validate,
  async (req, res) => {
    const { roleId, permissionIds } = req.body;

    try {
      await db("BEGIN");
      for (const pid of permissionIds) {
        await db(
          `INSERT INTO role_permissions(role_id, permission_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [roleId, pid]
        );
      }
      await db("COMMIT");
      res.status(200).send();
    } catch (e) {
      await db("ROLLBACK");
      res.status(500).json({ message: e.message });
    }
  }
);

export default router;
