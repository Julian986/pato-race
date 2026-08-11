/**
 * Conexión Neon (opcional).
 * Si no hay DATABASE_URL, la app usa `data/store.json` vía `src/lib/db/store.ts`.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/db/schema";

export function getNeonDb() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  const sql = neon(url);
  return drizzle(sql, { schema });
}
