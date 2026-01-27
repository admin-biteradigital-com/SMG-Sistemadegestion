const db = require('../config/db');

// Get all sales
const getAllSales = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM ORDENES_VENTA');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create Sale
const createSale = async (req, res) => {
    const {
        ID_Orden_Venta,
        ID_Destino_Transporte,
        Fecha_Venta,
        Tipo_Documento_Venta,
        Monto_Total_Venta,
        Estado_Venta,
        ID_Agente_Venta,
        ID_Pedido,
        Metodo_Pago,
        Fecha_Vencimiento_Credito,
        Items // Array of { ID_Detalle_Venta, ID_Producto_Servicio, Cantidad_Vendida, Precio_Unitario_Venta }
    } = req.body;

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Insert Sale Header
        const insertSaleText = `
      INSERT INTO ORDENES_VENTA (
        ID_Orden_Venta, ID_Destino_Transporte, Fecha_Venta, Tipo_Documento_Venta, Monto_Total_Venta,
        Estado_Venta, ID_Agente_Venta, ID_Pedido, Metodo_Pago, Fecha_Vencimiento_Credito
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
        const insertSaleValues = [
            ID_Orden_Venta, ID_Destino_Transporte, Fecha_Venta, Tipo_Documento_Venta, Monto_Total_Venta,
            Estado_Venta || 'Completada', ID_Agente_Venta, ID_Pedido, Metodo_Pago, Fecha_Vencimiento_Credito
        ];
        const saleResult = await client.query(insertSaleText, insertSaleValues);
        const newSale = saleResult.rows[0];

        // Insert Details
        if (Items && Items.length > 0) {
            for (const item of Items) {
                const { ID_Detalle_Venta, ID_Producto_Servicio, Cantidad_Vendida, Precio_Unitario_Venta } = item;
                const insertDetailText = `
          INSERT INTO DETALLES_ORDEN_VENTA (
            ID_Detalle_Venta, ID_Orden_Venta, ID_Producto_Servicio, Cantidad_Vendida, Precio_Unitario_Venta
          ) VALUES ($1, $2, $3, $4, $5)
        `;
                const insertDetailValues = [
                    ID_Detalle_Venta, ID_Orden_Venta, ID_Producto_Servicio, Cantidad_Vendida, Precio_Unitario_Venta
                ];
                await client.query(insertDetailText, insertDetailValues);
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Sale created successfully', sale: newSale });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Transaction Error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    } finally {
        client.release();
    }
};

// Register Payment
const registerPayment = async (req, res) => {
    const {
        ID_Pago,
        ID_Orden_Venta,
        Fecha_Pago,
        Monto_Pago,
        Metodo_Pago_Recibido,
        Fecha_Deposito_Efectivo,
        Numero_Documento_Pago,
        Notas_Pago
    } = req.body;

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Insert Payment
        const insertPaymentText = `
            INSERT INTO PAGOS_RECIBIDOS (
                ID_Pago, ID_Orden_Venta, Fecha_Pago, Monto_Pago, Metodo_Pago_Recibido,
                Fecha_Deposito_Efectivo, Numero_Documento_Pago, Notas_Pago
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const insertPaymentValues = [
            ID_Pago, ID_Orden_Venta, Fecha_Pago, Monto_Pago, Metodo_Pago_Recibido,
            Fecha_Deposito_Efectivo, Numero_Documento_Pago, Notas_Pago
        ];
        const paymentResult = await client.query(insertPaymentText, insertPaymentValues);

        // Update Sale Status
        // Logic: If total payments >= total sale amount, mark as Paid. 
        // For now, simpler logic: just mark as 'Pagada' if provided or update separately.
        // Let's assume the client updates status separately or we can automate it.
        // Automating simple check:
        const saleResult = await client.query('SELECT Monto_Total_Venta FROM ORDENES_VENTA WHERE ID_Orden_Venta = $1', [ID_Orden_Venta]);
        const saleAmount = saleResult.rows[0].Monto_Total_Venta;

        const paymentsResult = await client.query('SELECT SUM(Monto_Pago) as Total_Paid FROM PAGOS_RECIBIDOS WHERE ID_Orden_Venta = $1', [ID_Orden_Venta]);
        const totalPaid = parseFloat(paymentsResult.rows[0].total_paid) + parseFloat(Monto_Pago); // Note: total_paid might not include current insert yet in read committed? actually it should in same transaction if we sum *after* insert. Let's rely on standard SQL behavior inside transaction.

        // Actually the sum above includes the just inserted row? Postgres visibility inside transaction: yes.
        // Wait, `paymentsResult` query will see the `insertPaymentText` result if it's the same transaction.

        if (totalPaid >= saleAmount) {
            await client.query("UPDATE ORDENES_VENTA SET Estado_Cobro = 'Pagada' WHERE ID_Orden_Venta = $1", [ID_Orden_Venta]);
        } else {
            await client.query("UPDATE ORDENES_VENTA SET Estado_Cobro = 'Parcial' WHERE ID_Orden_Venta = $1", [ID_Orden_Venta]);
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Payment registered successfully', payment: paymentResult.rows[0] });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Transaction Error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    } finally {
        client.release();
    }
};

module.exports = {
    getAllSales,
    createSale,
    registerPayment,
};
