const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
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

async function runSeedData() {
    try {
        console.log('🌱 Iniciando carga de datos de prueba...');

        const sqlPath = path.join(__dirname, 'seed_test_data.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await pool.query(sql);

        console.log('✅ Datos de prueba cargados exitosamente');

        // Verificación
        const productsCount = await pool.query('SELECT COUNT(*) FROM productos_servicios');
        const clientsCount = await pool.query('SELECT COUNT(*) FROM clientes');
        const salesCount = await pool.query('SELECT COUNT(*) FROM ordenes_venta');

        console.log(`\n📊 Resumen:`);
        console.log(`   Productos: ${productsCount.rows[0].count}`);
        console.log(`   Clientes: ${clientsCount.rows[0].count}`);
        console.log(`   Ventas: ${salesCount.rows[0].count}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error al cargar datos de prueba:', error);
        process.exit(1);
    }
}

runSeedData();
