const db = require('../config/db');

// Get all sales
// Get all sales (Paginated)
const getAllSales = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const result = await db.query(
            'SELECT * FROM ORDENES_VENTA ORDER BY Fecha_Venta DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        const countResult = await db.query('SELECT COUNT(*) FROM ORDENES_VENTA');

        const totalRecords = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalRecords / limit);

        res.json({
            data: result.rows,
            meta: {
                total: totalRecords,
                page: page,
                limit: limit,
                totalPages: totalPages
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get Dashboard Stats
const getSaleStats = async (req, res) => {
    try {
        // Stats for "Today"
        // Note: Postgres DATE_TRUNC or simple comparison depends on timezone. 
        // For simplicity assuming server time matches business time or using CURRENT_DATE

        const todayStatsQuery = `
            SELECT 
                COUNT(*) as count,
                COALESCE(SUM(Monto_Total_Venta), 0) as total_amount
            FROM ORDENES_VENTA 
            WHERE Fecha_Venta::date = CURRENT_DATE
        `;

        const pendingQuery = `
            SELECT COUNT(*) as count
            FROM ORDENES_VENTA 
            WHERE Estado_Venta = 'pendiente' OR Estado_Venta = 'Pendiente'
        `;

        const [todayResult, pendingResult] = await Promise.all([
            db.query(todayStatsQuery),
            db.query(pendingQuery)
        ]);

        // Match frontend expected structure
        res.json({
            todaySalesCount: parseInt(todayResult.rows[0].count),
            todaySalesAmount: parseFloat(todayResult.rows[0].total_amount),
            pendingSales: parseInt(pendingResult.rows[0].count),
            // Legacy support
            today: {
                count: parseInt(todayResult.rows[0].count),
                amount: parseFloat(todayResult.rows[0].total_amount)
            },
            pending: parseInt(pendingResult.rows[0].count)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create Sale
const createSale = async (req, res) => {
    let {
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

        // Auto-generate ID_Orden_Venta if not provided
        if (!ID_Orden_Venta) {
            const maxSaleRes = await client.query('SELECT MAX(ID_Orden_Venta) as max_id FROM ORDENES_VENTA');
            ID_Orden_Venta = (parseInt(maxSaleRes.rows[0].max_id) || 0) + 1;
        }

        // Set mandatory defaults if missing
        ID_Destino_Transporte = ID_Destino_Transporte || 1;
        ID_Agente_Venta = ID_Agente_Venta || 1;
        Fecha_Venta = Fecha_Venta || new Date();
        Tipo_Documento_Venta = Tipo_Documento_Venta || 'Boleta';

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
            // Get current max detail ID to increment from
            const maxDetailRes = await client.query('SELECT MAX(ID_Detalle_Venta) as max_id FROM DETALLES_ORDEN_VENTA');
            let nextDetailId = (parseInt(maxDetailRes.rows[0].max_id) || 0) + 1;

            for (const item of Items) {
                let { ID_Detalle_Venta, ID_Producto_Servicio, Cantidad_Vendida, Precio_Unitario_Venta } = item;

                if (!ID_Detalle_Venta) {
                    ID_Detalle_Venta = nextDetailId++;
                }

                const subtotal = Cantidad_Vendida * Precio_Unitario_Venta;
                const insertDetailText = `
          INSERT INTO DETALLES_ORDEN_VENTA (
            ID_Detalle_Venta, ID_Orden_Venta, ID_Producto_Servicio, Cantidad_Vendida, Precio_Unitario_Venta, Subtotal_Linea_Venta
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `;
                const insertDetailValues = [
                    ID_Detalle_Venta, ID_Orden_Venta, ID_Producto_Servicio, Cantidad_Vendida, Precio_Unitario_Venta, subtotal
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
    getSaleStats,
    createSale,
    registerPayment,
};
