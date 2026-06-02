import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;

if (connectionString) {
  try {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
        ? false
        : { rejectUnauthorized: false },
      family: 4
    } as any);
    console.log('PostgreSQL Connection Pool initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize PostgreSQL Connection Pool:', err);
  }
} else {
  console.warn('DATABASE_URL environment variable is missing. Running in zero-DB mode.');
}

/**
 * Execute SQL queries against the PostgreSQL database.
 */
export async function query(text: string, params?: any[]) {
  if (!pool) {
    console.log(`[NO-DB MODE] Mock Query: "${text}" params:`, params);
    return { rows: [], rowCount: 0 };
  }
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error(`PostgreSQL Query Error: "${text}":`, error);
    throw error;
  }
}
