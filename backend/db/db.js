import { Pool } from "pg";
import "dotenv/config.js";

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const connectionString = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
export const pool = new Pool({ connectionString });

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}
