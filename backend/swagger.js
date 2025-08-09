import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function swagger(app) {
  const swaggerDoc = YAML.load(path.join(__dirname, "swaggerAPI.yaml"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}
