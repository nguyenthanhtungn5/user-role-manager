import { Router } from "express";
import { body, query, validationResult } from "express-validator";
import { query as dbQuery } from "../db/db.js";

const router = Router();

// POST /users
router.post(
  "/",
  body("firstName").isString().trim().notEmpty(),
  body("lastName").isString().trim().notEmpty(),
  body("email").isEmail(),
  body("phone").optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { firstName, lastName, email, phone } = req.body;
    try {
      const { rows } = await dbQuery(
        `INSERT INTO users(first_name,last_name,email,phone)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [firstName, lastName, email, phone || null]
      );
      res.status(201).json(rows[0]);
    } catch (e) {
      if (e.code === "23505")
        return res.status(409).json({ message: "Email already exists" });
      console.error(e);
      res.status(500).json({ message: "Internal error" });
    }
  }
);

// GET /users?limit=&offset=&q=
router.get(
  "/",
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("offset").optional().isInt({ min: 0 }),
  async (req, res) => {
    const limit = Number(req.query.limit || 20);
    const offset = Number(req.query.offset || 0);
    const email = (req.query.email || "").toString().trim();

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
    const { rows } = await dbQuery(sql, params);
    res.json(rows);
  }
);

export default router;
