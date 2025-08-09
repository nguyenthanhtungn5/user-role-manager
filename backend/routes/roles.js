import { Router } from "express";
import users from "../data/users.js";
import roles from "../data/roles.js";

const router = Router();

// GET /api/users
router.get("/", (req, res) => {
  res.json(users);
});

// POST /api/users
router.post("/", (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  const id = Date.now().toString();
  const newUser = { id, firstName, lastName, email, phone, roles: [] };
  users.push(newUser);
  res.status(201).json(newUser);
});

// POST /api/users/:id/assign-role
router.post("/:id/assign-role", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  const { roleIds } = req.body;
  if (!user) return res.status(404).json({ error: "User not found" });

  user.roles = roles.filter((r) => roleIds.includes(r.id));
  res.json({ message: "Rolle(n) zugewiesen", roles: user.roles });
});

export default router;
