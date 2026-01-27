const db = require('../config/db');

// Get all stock
const getAllStock = async (req, res) => {
    try {
        const result = await db.query(`
      SELECT s.*, p.Nombre_Producto_Servicio 
      FROM STOCK_DEPOSITO s
      JOIN PRODUCTOS_SERVICIOS p ON s.ID_Producto_Servicio = p.ID_Producto_Servicio
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllStock,
};
