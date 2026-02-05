const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkSchema() {
    try {
        console.log('🔍 Verificando esquema de la base de datos...\n');

        // Verificar tablas existentes
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        console.log('📋 Tablas encontradas:');
        tables.rows.forEach(row => console.log(`   - ${row.table_name}`));

        // Verificar columnas de productos_servicios
        console.log('\n📦 Columnas de productos_servicios:');
        const productColumns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'productos_servicios'
            ORDER BY ordinal_position
        `);
        productColumns.rows.forEach(row => console.log(`   - ${row.column_name} (${row.data_type})`));

        // Verificar columnas de clientes
        console.log('\n👥 Columnas de clientes:');
        const clientColumns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'clientes'
            ORDER BY ordinal_position
        `);
        clientColumns.rows.forEach(row => console.log(`   - ${row.column_name} (${row.data_type})`));

        // Verificar columnas de ordenes_venta
        console.log('\n🛒 Columnas de ordenes_venta:');
        const salesColumns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'ordenes_venta'
            ORDER BY ordinal_position
        `);
        salesColumns.rows.forEach(row => console.log(`   - ${row.column_name} (${row.data_type})`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkSchema();
