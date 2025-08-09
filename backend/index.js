import "dotenv/config";
import express from "express";
import cors from "cors";

import usersRouter from "./routes/users.js";
import rolesRouter from "./routes/roles.js";
import permissionsRouter from "./routes/permissions.js";
import assignRouter from "./routes/assign.js";
import swagger from "./swagger.js"; // <- ESM-Export aus swagger.js

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Swagger-Doku
swagger(app);

// Routes
app.use("/api/users", usersRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/permissions", permissionsRouter);
app.use("/api/assign", assignRouter);

app.listen(PORT, () => {
  console.log(`API läuft auf http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
