const db = require('../config/db');

// Get all load orders
const getAllLoadOrders = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM ORDENES_CARGA');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create Load Order (Transactional with Stock Decrement)
const createLoadOrder = async (req, res) => {
    const {
        ID_Orden_Carga,
        Fecha_Carga,
        ID_Vehiculo,
        ID_Chofer,
        Estado_Carga,
        Observaciones,
        Items // Array of { ID_Detalle_Orden_Carga, ID_Producto_Servicio, ID_Peon_Carga, Cantidad_Cargada, Numero_Lote_Cargado }
    } = req.body;

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Insert Load Order
        const insertLoadText = `
      INSERT INTO ORDENES_CARGA (
        ID_Orden_Carga, Fecha_Carga, ID_Vehiculo, ID_Chofer, Estado_Carga, Observaciones
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const insertLoadValues = [
            ID_Orden_Carga, Fecha_Carga, ID_Vehiculo, ID_Chofer, Estado_Carga || 'Pendiente', Observaciones
        ];
        const loadResult = await client.query(insertLoadText, insertLoadValues);
        const newLoadOrder = loadResult.rows[0];

        // 2. Insert Details and Decrement Stock
        if (Items && Items.length > 0) {
            for (const item of Items) {
                const { ID_Detalle_Orden_Carga, ID_Producto_Servicio, ID_Peon_Carga, Cantidad_Cargada, Numero_Lote_Cargado } = item;

                // Check Stock Availability
                // Note: We need a valid batch (Numero_Lote) to deduct from specific stock
                // If Numero_Lote is not provided, we might need a strategy (FIFO?), but for this phase we assume explicit lot selection.
                if (!Numero_Lote_Cargado) {
                    throw new Error(`Product ${ID_Producto_Servicio} requires a Batch Number (Numero_Lote) to load.`);
                }

                const checkStockText = `
            SELECT * FROM STOCK_DEPOSITO 
            WHERE ID_Producto_Servicio = $1 AND Numero_Lote = $2
            FOR UPDATE
        `; // Lock the row
                const stockResult = await client.query(checkStockText, [ID_Producto_Servicio, Numero_Lote_Cargado]);

                if (stockResult.rows.length === 0) {
                    throw new Error(`Stock not found for Product ${ID_Producto_Servicio} Batch ${Numero_Lote_Cargado}`);
                }

                const currentStock = stockResult.rows[0].Cantidad_Actual_Lote;
                if (currentStock < Cantidad_Cargada) {
                    throw new Error(`Insufficient stock for Product ${ID_Producto_Servicio} Batch ${Numero_Lote_Cargado}. Requested: ${Cantidad_Cargada}, Available: ${currentStock}`);
                }

                // Decrement Stock
                const updateStockText = `
            UPDATE STOCK_DEPOSITO
            SET Cantidad_Actual_Lote = Cantidad_Actual_Lote - $1, Ultima_Actualizacion_Lote = NOW()
            WHERE ID_Producto_Servicio = $2 AND Numero_Lote = $3
        `;
                await client.query(updateStockText, [Cantidad_Cargada, ID_Producto_Servicio, Numero_Lote_Cargado]);


                // Insert Detail
                const insertDetailText = `
          INSERT INTO DETALLES_ORDEN_CARGA (
            ID_Detalle_Orden_Carga, ID_Orden_Carga, ID_Producto_Servicio, ID_Peon_Carga, Cantidad_Cargada, Numero_Lote_Cargado
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `;
                const insertDetailValues = [
                    ID_Detalle_Orden_Carga, ID_Orden_Carga, ID_Producto_Servicio, ID_Peon_Carga, Cantidad_Cargada, Numero_Lote_Cargado
                ];
                await client.query(insertDetailText, insertDetailValues);
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Load order created and stock decremented successfully', loadOrder: newLoadOrder });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Transaction Error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    } finally {
        client.release();
    }
};

module.exports = {
    getAllLoadOrders,
    createLoadOrder,
};
