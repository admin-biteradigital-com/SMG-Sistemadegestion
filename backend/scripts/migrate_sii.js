const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../src/config/db');

async function migrateSii() {
    try {
        const schemaPath = path.join(__dirname, '../src/database/sii_schema.sql');
        console.log(`Reading SII schema from: ${schemaPath}`);

        if (!fs.existsSync(schemaPath)) {
            console.error('Schema file not found!');
            process.exit(1);
        }

        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log('Executing SII migration...');

        await db.query(schemaSql);
        console.log('SII Database tables created successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error migrating SII database:', err);
        process.exit(1);
    }
}

migrateSii();
