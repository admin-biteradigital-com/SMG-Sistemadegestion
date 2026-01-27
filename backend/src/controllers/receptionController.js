const db = require('../config/db');

// Get all receptions
const getAllReceptions = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM RECEPCIONES_MERCADERIA');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create Reception (Transactional)
const createReception = async (req, res) => {
    const {
        ID_Recepcion,
        ID_Orden,
        Fecha_Recepcion,
        Nro_Guia_Remision,
        Observaciones,
        Items // Array of { ID_Detalle_Recepcion, ID_Producto_Servicio, Cantidad_Recibida, Fecha_Vencimiento, Numero_Lote }
    } = req.body;

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Insert Reception Header
        const insertReceptionText = `
      INSERT INTO RECEPCIONES_MERCADERIA (
        ID_Recepcion, ID_Orden, Fecha_Recepcion, Nro_Guia_Remision, Observaciones
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const insertReceptionValues = [
            ID_Recepcion, ID_Orden, Fecha_Recepcion, Nro_Guia_Remision, Observaciones
        ];
        const receptionResult = await client.query(insertReceptionText, insertReceptionValues);
        const newReception = receptionResult.rows[0];

        // 2. Insert Details & Update Stock
        if (Items && Items.length > 0) {
            for (const item of Items) {
                const { ID_Detalle_Recepcion, ID_Producto_Servicio, Cantidad_Recibida, Fecha_Vencimiento, Numero_Lote } = item;

                // Insert Detail
                const insertDetailText = `
          INSERT INTO DETALLES_RECEPCION (
            ID_Detalle_Recepcion, ID_Recepcion, ID_Producto_Servicio, Cantidad_Recibida, Fecha_Vencimiento, Numero_Lote
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `;
                const insertDetailValues = [
                    ID_Detalle_Recepcion, ID_Recepcion, ID_Producto_Servicio, Cantidad_Recibida, Fecha_Vencimiento, Numero_Lote
                ];
                await client.query(insertDetailText, insertDetailValues);

                // Update Stock (STOCK_DEPOSITO)
                // Check if stock entry exists for this Product + Lot + Expiry
                const checkStockText = `
          SELECT * FROM STOCK_DEPOSITO 
          WHERE ID_Producto_Servicio = $1 AND Numero_Lote = $2 AND Fecha_Vencimiento = $3
        `;
                const checkStockValues = [ID_Producto_Servicio, Numero_Lote, Fecha_Vencimiento];
                const stockResult = await client.query(checkStockText, checkStockValues);

                const now = new Date();

                if (stockResult.rows.length > 0) {
                    // Update existing stock
                    const updateStockText = `
            UPDATE STOCK_DEPOSITO 
            SET Cantidad_Actual_Lote = Cantidad_Actual_Lote + $1, Ultima_Actualizacion_Lote = $2
            WHERE ID_Producto_Servicio = $3 AND Numero_Lote = $4 AND Fecha_Vencimiento = $5
          `;
                    await client.query(updateStockText, [Cantidad_Recibida, now, ID_Producto_Servicio, Numero_Lote, Fecha_Vencimiento]);
                } else {
                    // Insert new stock entry
                    // Warning: We need a unique ID for STOCK_DEPOSITO. We'll generate a random one or expect it?
                    // The schema has ID_Stock as PK. It's best if it's auto-increment, but as per previous observation, it seems manual.
                    // Since we are automating this, we MUST generate an ID.
                    // Strategy: Get max ID and increment. Note: This is not concurrency safe but fits the current constraint of manual IDs.
                    const maxIdResult = await client.query('SELECT MAX(ID_Stock) as max_id FROM STOCK_DEPOSITO');
                    const nextId = (maxIdResult.rows[0].max_id || 0) + 1;

                    const insertStockText = `
            INSERT INTO STOCK_DEPOSITO (
              ID_Stock, ID_Producto_Servicio, Numero_Lote, Fecha_Vencimiento, Cantidad_Actual_Lote, Ultima_Actualizacion_Lote
            ) VALUES ($1, $2, $3, $4, $5, $6)
          `;
                    await client.query(insertStockText, [nextId, ID_Producto_Servicio, Numero_Lote, Fecha_Vencimiento, Cantidad_Recibida, now]);
                }
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Reception created and stock updated successfully', reception: newReception });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Transaction Error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    } finally {
        client.release();
    }
};

module.exports = {
    getAllReceptions,
    createReception,
};
