const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

async function initDb() {
    try {
        const schemaPath = path.join(__dirname, '../../database/01_smg_schema.sql');
        console.log(`Reading schema from: ${schemaPath}`);

        if (!fs.existsSync(schemaPath)) {
            console.error('Schema file not found!');
            process.exit(1);
        }

        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log('Executing schema...');

        await db.query(schemaSql);
        console.log('Database initialized successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
}

initDb();
