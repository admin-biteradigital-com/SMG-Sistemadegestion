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
    // Si tenantId está presente, abrir un cliente usando getClient() para aislar.
    // De lo contrario, ejecutar como admin/sin contexto (solo para scripts o queries base).
    if (tenantId) {
        const client = await getClient(tenantId);
        try {
            return await client.query(text, params);
        } finally {
            client.release();
        }
    } else {
        return pool.query(text, params);
    }
};

/**
 * Retorna el pool de conexiones para el tenant dado.
 * Hoy usa el pool singleton; en el futuro puede derivar a pools separados por tenant.
 * @param {string} tenantId
 * @returns {Pool}
 */
const getPool = (tenantId) => pool;

/**
 * Adquiere un cliente transaccional exclusivo del pool 
 * y le inyecta el contexto del tenant vía `set_config`.
 * Es indispensable para transacciones (BEGIN/COMMIT).
 * @param {string} tenantId
 * @returns {Client} Instancia del cliente pg. ¡DEBE LLAMARSE client.release() AL TERMINAR!
 */
const getClient = async (tenantId) => {
    const client = await pool.connect();
    if (tenantId) {
        await client.query("SELECT set_config('app.current_tenant', $1, true)", [tenantId]);
    }
    return client;
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    queryMultiTenant,
    getPool,
    getClient,
    pool,
};
