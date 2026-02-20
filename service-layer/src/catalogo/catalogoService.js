const { queryMultiTenant } = require('@smg/database-layer/src/db');

class CatalogoService {
    /**
     * Obtiene todos los productos del catálogo público de un tenant específico.
     * Solo retorna la información pública que interesa al cliente final.
     */
    static async getPublicProducts(tenantId) {
        // En un entorno de producción, esto puede filtrar stock > 0 y solo campos públicos.
        const query = `
            SELECT 
                ID_Producto_Servicio as "id", 
                Nombre_Producto_Servicio as "nombre", 
                Descripcion_Producto_Servicio as "descripcion", 
                Precio_Unitario_Sugerido as "precio",
                Codigo_Barras as "codigoBarras"
            FROM PRODUCTOS_SERVICIOS
        `;
        const result = await queryMultiTenant(query, [], tenantId);
        return result.rows;
    }

    /**
     * Obtiene los detalles de un solo producto público por ID.
     */
    static async getPublicProductById(tenantId, id) {
        const query = `
            SELECT 
                ID_Producto_Servicio as "id", 
                Nombre_Producto_Servicio as "nombre", 
                Descripcion_Producto_Servicio as "descripcion", 
                Precio_Unitario_Sugerido as "precio",
                Codigo_Barras as "codigoBarras",
                Codigo_QR as "codigoQR"
            FROM PRODUCTOS_SERVICIOS
            WHERE ID_Producto_Servicio = $1
        `;
        const result = await queryMultiTenant(query, [id], tenantId);
        return result.rows[0] || null;
    }
}

module.exports = CatalogoService;
