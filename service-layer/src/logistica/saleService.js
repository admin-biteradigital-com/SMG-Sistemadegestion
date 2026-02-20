const { queryMultiTenant, getPool } = require('@smg/database-layer/src/db');

class SaleService {
    static async getAllSales(tenantId) {
        const result = await queryMultiTenant('SELECT * FROM ORDENES_VENTA', [], tenantId);
        return result.rows;
    }

    static async createSale(tenantId, data) {
        const {
            ID_Orden_Venta, ID_Destino_Transporte, Fecha_Venta, Tipo_Documento_Venta,
            Monto_Total_Venta, Estado_Venta, ID_Agente_Venta, ID_Pedido, Metodo_Pago,
            Fecha_Vencimiento_Credito, Items
        } = data;

        const pool = getPool(tenantId);
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const insertSaleText = `
                INSERT INTO ORDENES_VENTA (
                    ID_Orden_Venta, ID_Destino_Transporte, Fecha_Venta, Tipo_Documento_Venta, Monto_Total_Venta,
                    Estado_Venta, ID_Agente_Venta, ID_Pedido, Metodo_Pago, Fecha_Vencimiento_Credito
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
            `;
            const saleResult = await client.query(insertSaleText, [
                ID_Orden_Venta, ID_Destino_Transporte, Fecha_Venta, Tipo_Documento_Venta, Monto_Total_Venta,
                Estado_Venta || 'Completada', ID_Agente_Venta, ID_Pedido, Metodo_Pago, Fecha_Vencimiento_Credito
            ]);
            const newSale = saleResult.rows[0];

            if (Items && Items.length > 0) {
                for (const item of Items) {
                    const { ID_Detalle_Venta, ID_Producto_Servicio, Cantidad_Vendida, Precio_Unitario_Venta } = item;
                    await client.query(
                        `INSERT INTO DETALLES_ORDEN_VENTA (ID_Detalle_Venta, ID_Orden_Venta, ID_Producto_Servicio, Cantidad_Vendida, Precio_Unitario_Venta) VALUES ($1, $2, $3, $4, $5)`,
                        [ID_Detalle_Venta, ID_Orden_Venta, ID_Producto_Servicio, Cantidad_Vendida, Precio_Unitario_Venta]
                    );
                }
            }

            await client.query('COMMIT');
            return newSale;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    static async registerPayment(tenantId, data) {
        const {
            ID_Pago, ID_Orden_Venta, Fecha_Pago, Monto_Pago, Metodo_Pago_Recibido,
            Fecha_Deposito_Efectivo, Numero_Documento_Pago, Notas_Pago
        } = data;

        const pool = getPool(tenantId);
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const insertPaymentText = `
                INSERT INTO PAGOS_RECIBIDOS (
                    ID_Pago, ID_Orden_Venta, Fecha_Pago, Monto_Pago, Metodo_Pago_Recibido,
                    Fecha_Deposito_Efectivo, Numero_Documento_Pago, Notas_Pago
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
            `;
            const paymentResult = await client.query(insertPaymentText, [
                ID_Pago, ID_Orden_Venta, Fecha_Pago, Monto_Pago, Metodo_Pago_Recibido,
                Fecha_Deposito_Efectivo, Numero_Documento_Pago, Notas_Pago
            ]);

            // Automatic payment-status logic
            const saleResult = await client.query('SELECT Monto_Total_Venta FROM ORDENES_VENTA WHERE ID_Orden_Venta = $1', [ID_Orden_Venta]);
            const saleAmount = parseFloat(saleResult.rows[0].monto_total_venta);

            const paymentsResult = await client.query('SELECT COALESCE(SUM(Monto_Pago), 0) as total_paid FROM PAGOS_RECIBIDOS WHERE ID_Orden_Venta = $1', [ID_Orden_Venta]);
            const totalPaid = parseFloat(paymentsResult.rows[0].total_paid);

            const newEstado = totalPaid >= saleAmount ? 'Pagada' : 'Parcial';
            await client.query(`UPDATE ORDENES_VENTA SET Estado_Cobro = $1 WHERE ID_Orden_Venta = $2`, [newEstado, ID_Orden_Venta]);

            await client.query('COMMIT');
            return paymentResult.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}

module.exports = SaleService;
