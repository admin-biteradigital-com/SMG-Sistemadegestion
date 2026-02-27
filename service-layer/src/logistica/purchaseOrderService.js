const { queryMultiTenant, getClient } = require('@smg/database-layer/src/db');

class PurchaseOrderService {
    static async getAllPurchaseOrders(tenantId) {
        const result = await queryMultiTenant('SELECT * FROM ORDENES_COMPRA', [], tenantId);
        return result.rows;
    }

    static async getPurchaseOrderById(tenantId, id) {
        const orderResult = await queryMultiTenant('SELECT * FROM ORDENES_COMPRA WHERE ID_Orden = $1', [id], tenantId);
        if (!orderResult.rows[0]) return null;

        const detailsResult = await queryMultiTenant('SELECT * FROM DETALLES_ORDEN WHERE ID_Orden = $1', [id], tenantId);
        const order = orderResult.rows[0];
        order.items = detailsResult.rows;
        return order;
    }

    static async createPurchaseOrder(tenantId, data) {
        const { ID_Orden, Fecha_Creacion, Fecha_Entrega_Estimada, Estado_Orden, Total_Orden, Notas, ID_Proveedor, Items } = data;
        const client = await getClient(tenantId);

        try {
            await client.query('BEGIN');

            const insertOrderText = `
                INSERT INTO ORDENES_COMPRA (
                    ID_Orden, Fecha_Creacion, Fecha_Entrega_Estimada, Estado_Orden, Total_Orden, Notas, ID_Proveedor
                ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
            `;
            const orderResult = await client.query(insertOrderText, [
                ID_Orden, Fecha_Creacion, Fecha_Entrega_Estimada, Estado_Orden || 'Pendiente', Total_Orden, Notas, ID_Proveedor
            ]);
            const newOrder = orderResult.rows[0];

            if (Items && Items.length > 0) {
                for (const item of Items) {
                    const { ID_Detalle_Orden, ID_Producto_Servicio, Cantidad, Precio_Unitario_Acordado } = item;
                    await client.query(
                        `INSERT INTO DETALLES_ORDEN (ID_Detalle_Orden, ID_Orden, ID_Producto_Servicio, Cantidad, Precio_Unitario_Acordado) VALUES ($1, $2, $3, $4, $5)`,
                        [ID_Detalle_Orden, ID_Orden, ID_Producto_Servicio, Cantidad, Precio_Unitario_Acordado]
                    );
                }
            }

            await client.query('COMMIT');
            return { order: newOrder, itemsCount: Items ? Items.length : 0 };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    static async updatePurchaseOrderStatus(tenantId, id, Estado_Orden) {
        const result = await queryMultiTenant(
            'UPDATE ORDENES_COMPRA SET Estado_Orden = $1 WHERE ID_Orden = $2 RETURNING *',
            [Estado_Orden, id],
            tenantId
        );
        return result.rows[0] || null;
    }
}

module.exports = PurchaseOrderService;
