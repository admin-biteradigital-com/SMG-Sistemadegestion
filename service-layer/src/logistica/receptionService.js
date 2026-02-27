const { queryMultiTenant, getClient } = require('@smg/database-layer/src/db');

class ReceptionService {
    static async getAllReceptions(tenantId) {
        const result = await queryMultiTenant('SELECT * FROM RECEPCIONES_MERCADERIA', [], tenantId);
        return result.rows;
    }

    static async createReception(tenantId, data) {
        const { ID_Recepcion, ID_Orden, Fecha_Recepcion, Nro_Guia_Remision, Observaciones, Items } = data;
        const client = await getClient(tenantId);

        try {
            await client.query('BEGIN');

            // 1. Insert Reception Header
            const receptionResult = await client.query(
                `INSERT INTO RECEPCIONES_MERCADERIA (ID_Recepcion, ID_Orden, Fecha_Recepcion, Nro_Guia_Remision, Observaciones)
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [ID_Recepcion, ID_Orden, Fecha_Recepcion, Nro_Guia_Remision, Observaciones]
            );
            const newReception = receptionResult.rows[0];

            // 2. Insert Details & Update Stock
            if (Items && Items.length > 0) {
                for (const item of Items) {
                    const { ID_Detalle_Recepcion, ID_Producto_Servicio, Cantidad_Recibida, Fecha_Vencimiento, Numero_Lote } = item;

                    await client.query(
                        `INSERT INTO DETALLES_RECEPCION (ID_Detalle_Recepcion, ID_Recepcion, ID_Producto_Servicio, Cantidad_Recibida, Fecha_Vencimiento, Numero_Lote)
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [ID_Detalle_Recepcion, ID_Recepcion, ID_Producto_Servicio, Cantidad_Recibida, Fecha_Vencimiento, Numero_Lote]
                    );

                    // Upsert Stock
                    const stockResult = await client.query(
                        `SELECT * FROM STOCK_DEPOSITO WHERE ID_Producto_Servicio = $1 AND Numero_Lote = $2 AND Fecha_Vencimiento = $3`,
                        [ID_Producto_Servicio, Numero_Lote, Fecha_Vencimiento]
                    );

                    const now = new Date();
                    if (stockResult.rows.length > 0) {
                        await client.query(
                            `UPDATE STOCK_DEPOSITO SET Cantidad_Actual_Lote = Cantidad_Actual_Lote + $1, Ultima_Actualizacion_Lote = $2
                             WHERE ID_Producto_Servicio = $3 AND Numero_Lote = $4 AND Fecha_Vencimiento = $5`,
                            [Cantidad_Recibida, now, ID_Producto_Servicio, Numero_Lote, Fecha_Vencimiento]
                        );
                    } else {
                        const maxIdResult = await client.query('SELECT MAX(ID_Stock) as max_id FROM STOCK_DEPOSITO');
                        const nextId = (maxIdResult.rows[0].max_id || 0) + 1;
                        await client.query(
                            `INSERT INTO STOCK_DEPOSITO (ID_Stock, ID_Producto_Servicio, Numero_Lote, Fecha_Vencimiento, Cantidad_Actual_Lote, Ultima_Actualizacion_Lote)
                             VALUES ($1, $2, $3, $4, $5, $6)`,
                            [nextId, ID_Producto_Servicio, Numero_Lote, Fecha_Vencimiento, Cantidad_Recibida, now]
                        );
                    }
                }
            }

            await client.query('COMMIT');
            return newReception;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}

module.exports = ReceptionService;
