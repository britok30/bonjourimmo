import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
export const DATABASE_URL =
  "postgresql://neondb_owner:5iHN3cGIzgyv@ep-curly-lake-a21re7ty.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(DATABASE_URL);

export const db = drizzle(sql);
