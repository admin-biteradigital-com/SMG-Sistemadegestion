const { queryMultiTenant } = require('@smg/database-layer/src/db');

class ProductService {
    static async getAllProducts(tenantId) {
        // En una DB multi-tenant real, aquí se inyectaría la lógica de tenant.
        // Simularemos llamando al wrapper con el tenantId para futuros RLS.
        const result = await queryMultiTenant('SELECT * FROM PRODUCTOS_SERVICIOS', [], tenantId);
        return result.rows;
    }

    static async getProductById(tenantId, id) {
        const result = await queryMultiTenant('SELECT * FROM PRODUCTOS_SERVICIOS WHERE ID_Producto_Servicio = $1', [id], tenantId);
        return result.rows[0] || null;
    }

    static async createProduct(tenantId, productData) {
        const query = `
      INSERT INTO PRODUCTOS_SERVICIOS (
        ID_Producto_Servicio, Nombre_Producto_Servicio, Descripcion_Producto_Servicio,
        Precio_Unitario_Sugerido, Tiempo_Entrega_Proveedor_Dias, Stock_Seguridad_Minimo,
        Punto_Reorden, Cantidad_Reorden_Optima, ID_Unidad_Compra, ID_Unidad_Venta,
        ID_Unidad_Base, Codigo_Barras, Codigo_QR
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
        const values = [
            productData.ID_Producto_Servicio, productData.Nombre_Producto_Servicio, productData.Descripcion_Producto_Servicio,
            productData.Precio_Unitario_Sugerido, productData.Tiempo_Entrega_Proveedor_Dias, productData.Stock_Seguridad_Minimo,
            productData.Punto_Reorden, productData.Cantidad_Reorden_Optima, productData.ID_Unidad_Compra, productData.ID_Unidad_Venta,
            productData.ID_Unidad_Base, productData.Codigo_Barras, productData.Codigo_QR
        ];

        const result = await queryMultiTenant(query, values, tenantId);
        return result.rows[0];
    }

    static async updateProduct(tenantId, id, productData) {
        const query = `
      UPDATE PRODUCTOS_SERVICIOS SET
        Nombre_Producto_Servicio = $1, Descripcion_Producto_Servicio = $2,
        Precio_Unitario_Sugerido = $3, Tiempo_Entrega_Proveedor_Dias = $4,
        Stock_Seguridad_Minimo = $5, Punto_Reorden = $6, Cantidad_Reorden_Optima = $7,
        ID_Unidad_Compra = $8, ID_Unidad_Venta = $9, ID_Unidad_Base = $10,
        Codigo_Barras = $11, Codigo_QR = $12
      WHERE ID_Producto_Servicio = $13
      RETURNING *
    `;
        const values = [
            productData.Nombre_Producto_Servicio, productData.Descripcion_Producto_Servicio,
            productData.Precio_Unitario_Sugerido, productData.Tiempo_Entrega_Proveedor_Dias,
            productData.Stock_Seguridad_Minimo, productData.Punto_Reorden, productData.Cantidad_Reorden_Optima,
            productData.ID_Unidad_Compra, productData.ID_Unidad_Venta, productData.ID_Unidad_Base,
            productData.Codigo_Barras, productData.Codigo_QR, id
        ];

        const result = await queryMultiTenant(query, values, tenantId);
        return result.rows[0] || null;
    }

    static async deleteProduct(tenantId, id) {
        const result = await queryMultiTenant('DELETE FROM PRODUCTOS_SERVICIOS WHERE ID_Producto_Servicio = $1 RETURNING *', [id], tenantId);
        return result.rows[0] || null;
    }
}

module.exports = ProductService;
