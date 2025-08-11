import { Router } from "express";
import { body } from "express-validator";
import { pool } from "../db/db.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

// GET /api/assign/user-roles
router.get("/user-roles", async (req, res) => {
  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      `SELECT user_id AS userId, role_id AS roleId FROM user_roles`
    );
    res.status(200).send(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PUT /api/assign/user-roles  { userId, roleIds: [] }
router.put(
  "/user-roles",
  body("userId").isInt(),
  body("roleIds").isArray({ min: 1 }),
  body("roleIds.*").isInt(),
  validate,
  async (req, res) => {
    const { userId, roleIds } = req.body;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      // Delete all old assignments, that not in the list anymore
      await client.query(
        `DELETE FROM user_roles
         WHERE user_id = $1
         AND NOT (role_id = ANY($2::int[]))`,
        [userId, roleIds]
      );
      // Create new assignments
      await client.query(
        `INSERT INTO user_roles (user_id, role_id)
        SELECT $1, role_id 
        FROM (SELECT DISTINCT unnest($2::int[]) AS role_id) AS alias
        ON CONFLICT (user_id, role_id) DO NOTHING`,
        [userId, roleIds]
      );
      await client.query("COMMIT");
      res.status(204).send();
    } catch (e) {
      await client.query("ROLLBACK");
      res.status(500).json({ message: e.message });
    }
  }
);

// GET /api/assign/user-roles
router.get("/role-permissions", async (req, res) => {
  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      `SELECT role_id AS roleId, permission_id AS permissionId FROM role_permissions`
    );
    res.status(200).send(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PUT /api/assign/role-permissions  { roleId, permissionIds: [] }
router.put(
  "/role-permissions",
  body("roleId").isInt(),
  body("permissionIds").isArray({ min: 1 }),
  body("permissionIds.*").isInt(),
  validate,
  async (req, res) => {
    const { roleId, permissionIds } = req.body;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      // Delete all old assignments, that not in the list anymore
      await client.query(
        `DELETE FROM role_permissions
         WHERE role_id = $1
         AND NOT (permission_id = ANY($2::int[]))`,
        [roleId, permissionIds]
      );
      // Create new assignments
      await client.query(
        `INSERT INTO role_permissions (role_id, permission_id)
        SELECT $1, permission_id 
        FROM (SELECT DISTINCT unnest($2::int[]) AS permission_id) AS alias
        ON CONFLICT (role_id, permission_id) DO NOTHING`,
        [roleId, permissionIds]
      );
      await client.query("COMMIT");
      res.status(204).send();
    } catch (e) {
      await client.query("ROLLBACK");
      res.status(500).json({ message: e.message });
    }
  }
);

export default router;
