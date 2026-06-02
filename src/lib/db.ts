import { Pool } from 'pg';

// Support both Supabase (DATABASE_URL / POSTGRES_URL) and direct pg config
const connectionString = 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL || 
  process.env.SUPABASE_DB_URL;

let pool: Pool | null = null;

if (connectionString) {
  try {
    const isLocal =
      connectionString.includes('localhost') ||
      connectionString.includes('127.0.0.1');

    pool = new Pool({
      connectionString,
      // Supabase & Vercel Postgres both require SSL in production
      ssl: isLocal
        ? false
        : { rejectUnauthorized: false },
      // Vercel Serverless-friendly pool settings
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    console.log('PostgreSQL / Supabase Connection Pool initialized.');
  } catch (err) {
    console.error('Failed to initialize DB Connection Pool:', err);
  }
} else {
  console.warn(
    'DATABASE_URL / POSTGRES_URL / SUPABASE_DB_URL is missing. Running in zero-DB ephemeral mode.'
  );
}

/**
 * Execute SQL queries against the database.
 * Gracefully logs and returns an empty fallback if DB is not configured.
 */
export async function query(text: string, params?: any[]) {
  if (!pool) {
    console.log(`[NO-DB MODE] Mock Query: "${text}"`, params);
    return { rows: [], rowCount: 0 };
  }
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error(`DB Query Error on "${text}":`, error);
    throw error;
  }
}
