const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../backend/.env' });

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

async function seed() {
    try {
        await client.connect();
        console.log('✅ Connected to database');

        const sqlPath = path.join(__dirname, '../database/02_seed_data.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Executing seed script...');
        await client.query(sql);
        console.log('✅ Seed data inserted successfully!');

    } catch (err) {
        console.error('❌ Seed error:', err);
        // Log more details if it's a specific postgres error
        if (err.position) {
            console.error(`Position: ${err.position}`);
        }
        if (err.detail) {
            console.error(`Detail: ${err.detail}`);
        }
    } finally {
        await client.end();
    }
}

seed();
