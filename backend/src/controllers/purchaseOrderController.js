const db = require('../config/db');

// Get all purchase orders
const getAllPurchaseOrders = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM ORDENES_COMPRA');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get purchase order by ID (with details)
const getPurchaseOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const orderResult = await db.query('SELECT * FROM ORDENES_COMPRA WHERE ID_Orden = $1', [id]);
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase order not found' });
        }

        const detailsResult = await db.query('SELECT * FROM DETALLES_ORDEN WHERE ID_Orden = $1', [id]);

        const order = orderResult.rows[0];
        order.items = detailsResult.rows;

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create Purchase Order (Transactional)
const createPurchaseOrder = async (req, res) => {
    const {
        ID_Orden,
        Fecha_Creacion,
        Fecha_Entrega_Estimada,
        Estado_Orden,
        Total_Orden,
        Notas,
        ID_Proveedor,
        Items // Array of { ID_Detalle_Orden, ID_Producto_Servicio, Cantidad, Precio_Unitario_Acordado }
    } = req.body;

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Insert Order
        const insertOrderText = `
      INSERT INTO ORDENES_COMPRA (
        ID_Orden, Fecha_Creacion, Fecha_Entrega_Estimada, Estado_Orden, Total_Orden, Notas, ID_Proveedor
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const insertOrderValues = [
            ID_Orden, Fecha_Creacion, Fecha_Entrega_Estimada, Estado_Orden || 'Pendiente', Total_Orden, Notas, ID_Proveedor
        ];
        const orderResult = await client.query(insertOrderText, insertOrderValues);
        const newOrder = orderResult.rows[0];

        // Insert Details
        if (Items && Items.length > 0) {
            for (const item of Items) {
                const { ID_Detalle_Orden, ID_Producto_Servicio, Cantidad, Precio_Unitario_Acordado } = item;
                const insertDetailText = `
          INSERT INTO DETALLES_ORDEN (
            ID_Detalle_Orden, ID_Orden, ID_Producto_Servicio, Cantidad, Precio_Unitario_Acordado
          ) VALUES ($1, $2, $3, $4, $5)
        `;
                const insertDetailValues = [
                    ID_Detalle_Orden, ID_Orden, ID_Producto_Servicio, Cantidad, Precio_Unitario_Acordado
                ];
                await client.query(insertDetailText, insertDetailValues);
            }
        }

        await client.query('COMMIT');

        // Return the full order with confirmation
        res.status(201).json({ message: 'Purchase order created successfully', order: newOrder, itemsCount: Items ? Items.length : 0 });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Transaction Error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    } finally {
        client.release();
    }
};

// Update Purchase Order Status
const updatePurchaseOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { Estado_Orden } = req.body;

    try {
        const result = await db.query(
            'UPDATE ORDENES_COMPRA SET Estado_Orden = $1 WHERE ID_Orden = $2 RETURNING *',
            [Estado_Orden, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase order not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllPurchaseOrders,
    getPurchaseOrderById,
    createPurchaseOrder,
    updatePurchaseOrderStatus,
};
