const { Client } = require('pg');
require('dotenv').config({ path: '../backend/.env' });

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // Required for Neon
});

async function verify() {
    try {
        await client.connect();
        console.log('✅ Connected to database');

        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        console.log('\n📊 Tables found:', res.rows.length);
        if (res.rows.length === 0) {
            console.log('⚠️ Database is empty (no tables).');
        } else {
            for (const row of res.rows) {
                const countRes = await client.query(`SELECT COUNT(*) FROM "${row.table_name}"`);
                console.log(`- ${row.table_name}: ${countRes.rows[0].count} rows`);
            }
        }

    } catch (err) {
        console.error('❌ Connection error:', err.message);
    } finally {
        await client.end();
    }
}

verify();
