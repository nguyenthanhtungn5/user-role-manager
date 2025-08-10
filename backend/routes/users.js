import e, { Router } from "express";
import { body, query } from "express-validator";
import { query as dbQuery } from "../db/db.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

// POST /users
router.post(
  "/",
  body("firstName").isString().trim().notEmpty(),
  body("lastName").isString().trim().notEmpty(),
  body("email").isString().isEmail(),
  body("phone").isString(),
  validate,
  async (req, res) => {
    const { firstName, lastName, email, phone } = req.body;

    const sql = `INSERT INTO users (first_name, last_name, email, phone)
         VALUES ($1, $2, $3, $4) RETURNING *`;
    const params = [firstName, lastName, email, phone || null];

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

// GET /users?limit=&offset=&email=
router.get(
  "/",
  query("limit").optional().isInt({ min: 1, max: 99 }).toInt(),
  query("offset").optional().isInt({ min: 0 }).toInt(),
  query("email").optional().isEmail(),
  async (req, res) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;
    const email = (req.query.email || "").trim();

    const where = email ? `WHERE email LIKE $1` : "";
    const params = email ? [email, limit, offset] : [limit, offset];

    const sql = `
      SELECT id, 
        first_name AS "firstName", 
        last_name AS "lastName",
        email, 
        phone
      FROM users
      ${where}
      ORDER BY id DESC
      LIMIT $${email ? 2 : 1} OFFSET $${email ? 3 : 2}
    `;
    try {
      const { rows } = await dbQuery(sql, params);
      res.status(200).json(rows);
    } catch (e) {
      res.status(500).json({ errors: e.message });
    }
  }
);

export default router;
