const { queryMultiTenant } = require('@smg/database-layer/src/db');

class StockService {
    static async getAllStock(tenantId) {
        const result = await queryMultiTenant(
            `SELECT s.*, p.Nombre_Producto_Servicio 
             FROM STOCK_DEPOSITO s
             JOIN PRODUCTOS_SERVICIOS p ON s.ID_Producto_Servicio = p.ID_Producto_Servicio`,
            [],
            tenantId
        );
        return result.rows;
    }
}

module.exports = StockService;
