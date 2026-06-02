import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;

if (connectionString) {
  try {
    pool = new Pool({
      connectionString,
      // Local pgAdmin connections usually don't require SSL
      ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1') 
        ? false 
        : { rejectUnauthorized: false }
    });
    console.log("PostgreSQL Connection Pool initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize PostgreSQL Connection Pool:", err);
  }
} else {
  console.warn("DATABASE_URL environment variable is missing. App is running in zero-DB ephemeral mode.");
}

/**
 * Execute SQL queries against the local PostgreSQL database.
 * Gracefully logs and returns an empty fallback if DB is not configured.
 */
export async function query(text: string, params?: any[]) {
  if (!pool) {
    console.log(`[LOCAL DEV MODE] Mock Query executed: "${text}" with params:`, params);
    return { rows: [], rowCount: 0 };
  }
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error(`PostgreSQL Query Error executing "${text}":`, error);
    throw error;
  }
}
