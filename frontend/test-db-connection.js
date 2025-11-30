const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    port: 5433,
    database: 'landguard',
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ Connection successful!');

        const res = await client.query('SELECT COUNT(*) FROM hexagons');
        console.log(`✅ Found ${res.rows[0].count} hexagons in database`);

        client.release();
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
