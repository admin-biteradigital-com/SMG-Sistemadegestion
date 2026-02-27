const { queryMultiTenant, getClient } = require('@smg/database-layer/src/db');

class LoadOrderService {
    static async getAllLoadOrders(tenantId) {
        const result = await queryMultiTenant('SELECT * FROM ORDENES_CARGA', [], tenantId);
        return result.rows;
    }

    static async createLoadOrder(tenantId, data) {
        const { ID_Orden_Carga, Fecha_Carga, ID_Vehiculo, ID_Chofer, Estado_Carga, Observaciones, Items } = data;
        const client = await getClient(tenantId);

        try {
            await client.query('BEGIN');

            // 1. Insert Load Order Header
            const loadResult = await client.query(
                `INSERT INTO ORDENES_CARGA (ID_Orden_Carga, Fecha_Carga, ID_Vehiculo, ID_Chofer, Estado_Carga, Observaciones)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [ID_Orden_Carga, Fecha_Carga, ID_Vehiculo, ID_Chofer, Estado_Carga || 'Pendiente', Observaciones]
            );
            const newLoadOrder = loadResult.rows[0];

            // 2. Insert Details & Decrement Stock (with row-level locking)
            if (Items && Items.length > 0) {
                for (const item of Items) {
                    const { ID_Detalle_Orden_Carga, ID_Producto_Servicio, ID_Peon_Carga, Cantidad_Cargada, Numero_Lote_Cargado } = item;

                    if (!Numero_Lote_Cargado) {
                        throw new Error(`Producto ${ID_Producto_Servicio} requiere un Número de Lote para la carga.`);
                    }

                    // Lock stock row for update
                    const stockResult = await client.query(
                        `SELECT * FROM STOCK_DEPOSITO WHERE ID_Producto_Servicio = $1 AND Numero_Lote = $2 FOR UPDATE`,
                        [ID_Producto_Servicio, Numero_Lote_Cargado]
                    );

                    if (stockResult.rows.length === 0) {
                        throw new Error(`Stock no encontrado para Producto ${ID_Producto_Servicio} Lote ${Numero_Lote_Cargado}`);
                    }

                    const currentStock = stockResult.rows[0].cantidad_actual_lote;
                    if (currentStock < Cantidad_Cargada) {
                        throw new Error(`Stock insuficiente para Producto ${ID_Producto_Servicio} Lote ${Numero_Lote_Cargado}. Solicitado: ${Cantidad_Cargada}, Disponible: ${currentStock}`);
                    }

                    await client.query(
                        `UPDATE STOCK_DEPOSITO SET Cantidad_Actual_Lote = Cantidad_Actual_Lote - $1, Ultima_Actualizacion_Lote = NOW()
                         WHERE ID_Producto_Servicio = $2 AND Numero_Lote = $3`,
                        [Cantidad_Cargada, ID_Producto_Servicio, Numero_Lote_Cargado]
                    );

                    await client.query(
                        `INSERT INTO DETALLES_ORDEN_CARGA (ID_Detalle_Orden_Carga, ID_Orden_Carga, ID_Producto_Servicio, ID_Peon_Carga, Cantidad_Cargada, Numero_Lote_Cargado)
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [ID_Detalle_Orden_Carga, ID_Orden_Carga, ID_Producto_Servicio, ID_Peon_Carga, Cantidad_Cargada, Numero_Lote_Cargado]
                    );
                }
            }

            await client.query('COMMIT');
            return newLoadOrder;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}

module.exports = LoadOrderService;
