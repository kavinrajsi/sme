import { Pool } from "pg";

let pool;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URI;
    if (!connectionString) {
      throw new Error("DATABASE_URI is not configured.");
    }
    pool = new Pool({ connectionString, max: 5 });
  }
  return pool;
}

export function query(text, params) {
  return getPool().query(text, params);
}
