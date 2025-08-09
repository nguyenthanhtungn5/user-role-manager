import { Router } from "express";
import { body, validationResult } from "express-validator";
import { query as db } from "../db/db.js";

const router = Router();

// POST /assign/user-roles  { userId, roleIds: [] }
router.post(
  "/user-roles",
  body("userId").isInt(),
  body("roleIds").isArray({ min: 1 }),
  body("roleIds.*").isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { userId, roleIds } = req.body;
    try {
      await db("BEGIN");
      for (const roleId of roleIds) {
        await db(
          `INSERT INTO user_roles(user_id, role_id)
           VALUES ($1,$2)
           ON CONFLICT DO NOTHING`,
          [userId, roleId]
        );
      }
      await db("COMMIT");
      res.status(204).send();
    } catch (e) {
      await db("ROLLBACK");
      console.error(e);
      res.status(500).json({ message: "Internal error" });
    }
  }
);

// POST /assign/role-permissions  { roleId, permissionIds: [] }
router.post(
  "/role-permissions",
  body("roleId").isInt(),
  body("permissionIds").isArray({ min: 1 }),
  body("permissionIds.*").isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { roleId, permissionIds } = req.body;
    try {
      await db("BEGIN");
      for (const pid of permissionIds) {
        await db(
          `INSERT INTO role_permissions(role_id, permission_id)
           VALUES ($1,$2)
           ON CONFLICT DO NOTHING`,
          [roleId, pid]
        );
      }
      await db("COMMIT");
      res.status(204).send();
    } catch (e) {
      await db("ROLLBACK");
      console.error(e);
      res.status(500).json({ message: "Internal error" });
    }
  }
);

export default router;
