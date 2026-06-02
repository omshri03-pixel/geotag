const { Pool } = require('pg');

const variations = [
  {
    name: 'Password: @Omshri03 (with leading @)',
    url: 'postgresql://zyrox:%40Omshri03@localhost:5432/geotagger'
  },
  {
    name: 'Password: Omshri03 (without leading @)',
    url: 'postgresql://zyrox:Omshri03@localhost:5432/geotagger'
  }
];

async function runTests() {
  for (const item of variations) {
    console.log(`\nTesting variation: ${item.name}...`);
    const pool = new Pool({
      connectionString: item.url,
      ssl: false
    });
    
    try {
      const res = await pool.query('SELECT NOW()');
      console.log(`✅ Success! Connected successfully using: ${item.name}`);
      console.log(`Database server time: ${res.rows[0].now}`);
      pool.end();
      return; // Stop on first success
    } catch (err) {
      console.log(`❌ Failed: ${err.message}`);
    } finally {
      await pool.end();
    }
  }
  
  console.log("\n❌ Connection failed with both variations.");
}

runTests();
