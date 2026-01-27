const db = require('../config/db');

// Get all transport orders
const getAllTransportOrders = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM ORDENES_TRANSPORTE');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create Transport Order (Simple link)
const createTransportOrder = async (req, res) => {
    const {
        ID_Orden_Transporte,
        ID_Orden_Carga,
        ID_Ruta,
        Fecha_Salida,
        Fecha_Llegada_Estimada,
        Estado_Transporte,
        Observaciones,
        Destinations // Array of { ID_Destino_Transporte, ID_Sucursal, Orden_Visita }
    } = req.body;

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Insert Transport Order
        const insertTransportText = `
      INSERT INTO ORDENES_TRANSPORTE (
        ID_Orden_Transporte, ID_Orden_Carga, ID_Ruta, Fecha_Salida, Fecha_Llegada_Estimada, Estado_Transporte, Observaciones
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const insertTransportValues = [
            ID_Orden_Transporte, ID_Orden_Carga, ID_Ruta, Fecha_Salida, Fecha_Llegada_Estimada, Estado_Transporte || 'Programada', Observaciones
        ];
        const transportResult = await client.query(insertTransportText, insertTransportValues);


        // Insert Destinations
        if (Destinations && Destinations.length > 0) {
            for (const dest of Destinations) {
                const { ID_Destino_Transporte, ID_Sucursal, Orden_Visita, Tiempo_Estancia_Estimado_Minutos } = dest;
                const insertDestText = `
                INSERT INTO DESTINOS_TRANSPORTE (
                    ID_Destino_Transporte, ID_Orden_Transporte, ID_Sucursal, Orden_Visita, Tiempo_Estancia_Estimado_Minutos
                ) VALUES ($1, $2, $3, $4, $5)
            `;
                await client.query(insertDestText, [ID_Destino_Transporte, ID_Orden_Transporte, ID_Sucursal, Orden_Visita, Tiempo_Estancia_Estimado_Minutos]);
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Transport order created successfully', transportOrder: transportResult.rows[0] });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Transaction Error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    } finally {
        client.release();
    }
};

module.exports = {
    getAllTransportOrders,
    createTransportOrder,
};
