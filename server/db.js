import pg from 'pg';
import 'dotenv/config';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      country    TEXT,
      latitude   DOUBLE PRECISION NOT NULL,
      longitude  DOUBLE PRECISION NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE (latitude, longitude)
    );
  `);
}