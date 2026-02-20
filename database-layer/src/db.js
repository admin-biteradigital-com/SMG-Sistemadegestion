const { Pool } = require('pg');

// Configuración base. Idealmente, los credenciales vendrán del módulo core.
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'smg_database',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

/**
 * Wrapper multi-tenant para queries.
 * @param {string} text - Query SQL
 * @param {Array} params - Parámetros de la query
 * @param {string} tenantId - Identificador del tenant para aislar data (opcional, pero sugerido usar a nivel middleware)
 */
const queryMultiTenant = async (text, params, tenantId) => {
    // Si bien este wrapper es básico, marca el estándar para inyectar filtros o
    // variables temporales si se usar Row Level Security (RLS) en Postgres
    // Ej: await pool.query(`SET app.current_tenant = '${tenantId}'`);

    // Por ahora, el comportamiento delega en la construcción de la query.
    return pool.query(text, params);
};

/**
 * Retorna el pool de conexiones para el tenant dado.
 * Hoy usa el pool singleton; en el futuro puede derivar a pools separados por tenant.
 * @param {string} tenantId
 * @returns {Pool}
 */
const getPool = (tenantId) => pool;

module.exports = {
    query: (text, params) => pool.query(text, params),
    queryMultiTenant,
    getPool,
    pool,
};
