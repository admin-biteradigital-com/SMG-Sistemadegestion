const { queryMultiTenant, getClient } = require('@smg/database-layer/src/db');

class TransportService {
    static async getAllTransportOrders(tenantId) {
        const result = await queryMultiTenant('SELECT * FROM ORDENES_TRANSPORTE', [], tenantId);
        return result.rows;
    }

    static async createTransportOrder(tenantId, data) {
        const {
            ID_Orden_Transporte, ID_Orden_Carga, ID_Ruta, Fecha_Salida,
            Fecha_Llegada_Estimada, Estado_Transporte, Observaciones, Destinations
        } = data;

        const client = await getClient(tenantId);

        try {
            await client.query('BEGIN');

            const transportResult = await client.query(
                `INSERT INTO ORDENES_TRANSPORTE (ID_Orden_Transporte, ID_Orden_Carga, ID_Ruta, Fecha_Salida, Fecha_Llegada_Estimada, Estado_Transporte, Observaciones)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [ID_Orden_Transporte, ID_Orden_Carga, ID_Ruta, Fecha_Salida, Fecha_Llegada_Estimada, Estado_Transporte || 'Programada', Observaciones]
            );
            const newTransportOrder = transportResult.rows[0];

            if (Destinations && Destinations.length > 0) {
                for (const dest of Destinations) {
                    const { ID_Destino_Transporte, ID_Sucursal, Orden_Visita, Tiempo_Estancia_Estimado_Minutos } = dest;
                    await client.query(
                        `INSERT INTO DESTINOS_TRANSPORTE (ID_Destino_Transporte, ID_Orden_Transporte, ID_Sucursal, Orden_Visita, Tiempo_Estancia_Estimado_Minutos)
                         VALUES ($1, $2, $3, $4, $5)`,
                        [ID_Destino_Transporte, ID_Orden_Transporte, ID_Sucursal, Orden_Visita, Tiempo_Estancia_Estimado_Minutos]
                    );
                }
            }

            await client.query('COMMIT');
            return newTransportOrder;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}

module.exports = TransportService;
