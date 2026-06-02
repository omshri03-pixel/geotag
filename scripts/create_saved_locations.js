const { Pool } = require('pg');

const connectionString = 'postgresql://zyrox:%40Omshri03@localhost:5432/geotagger';

async function migrate() {
  console.log("Connecting to PostgreSQL...");
  const pool = new Pool({
    connectionString,
    ssl: false
  });

  try {
    // 1. Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_locations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          lat DECIMAL(10, 8) NOT NULL,
          lng DECIMAL(11, 8) NOT NULL,
          city VARCHAR(255) DEFAULT '',
          user_id INT REFERENCES users(id) ON DELETE CASCADE DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Table 'saved_locations' created or verified successfully.");

    // 2. Prefill default presets if table is empty
    const checkEmpty = await pool.query("SELECT COUNT(*)::int as count FROM saved_locations");
    if (checkEmpty.rows[0].count === 0) {
      console.log("Prefilling default SEO target location presets...");
      const defaults = [
        { name: 'Dr Joy Dental Clinic - BurJuman', lat: 25.25278100, lng: 55.30823300, city: 'Dubai' },
        { name: 'Liberty Dental Clinic - Jumeirah', lat: 25.21526400, lng: 55.25732100, city: 'Dubai' },
        { name: 'Acme Chiropractic Center - Al Barsha', lat: 25.11244000, lng: 55.19943000, city: 'Dubai' },
        { name: 'HealthBay Polyclinic - Umm Suqeim', lat: 25.17849000, lng: 55.23412000, city: 'Dubai' }
      ];

      for (const item of defaults) {
        await pool.query(
          "INSERT INTO saved_locations (name, lat, lng, city) VALUES ($1, $2, $3, $4)",
          [item.name, item.lat, item.lng, item.city]
        );
      }
      console.log("✅ Prefilled 4 default locations successfully!");
    } else {
      console.log("Presets already populated.");
    }
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrate();
