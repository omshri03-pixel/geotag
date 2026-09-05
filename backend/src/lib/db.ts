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
      family: connectionString.includes('localhost') || connectionString.includes('127.0.0.1') ? 4 : undefined,
      connectionTimeoutMillis: 5000,   // fail fast if DB is unreachable
      idleTimeoutMillis: 30000,
    } as any);
    console.log('PostgreSQL Connection Pool initialized successfully.');
    // Run lightweight schema self-heal
    pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
      CREATE TABLE IF NOT EXISTS saved_locations (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE DEFAULT 1,
        name VARCHAR(255) NOT NULL,
        lat DECIMAL(10, 8) NOT NULL,
        lng DECIMAL(11, 8) NOT NULL,
        city VARCHAR(255) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
      .then(() => console.log('Database schema verified (password_hash & saved_locations ready).'))
      .catch((e: any) => console.warn('Schema verification notice:', e.message));
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
