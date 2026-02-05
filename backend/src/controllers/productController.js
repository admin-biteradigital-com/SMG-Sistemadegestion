const db = require('../config/db');

// Get all products with pagination
const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        let queryText = 'SELECT * FROM PRODUCTOS_SERVICIOS';
        let countQueryText = 'SELECT COUNT(*) FROM PRODUCTOS_SERVICIOS';
        const queryParams = [];

        if (search) {
            const searchClause = ' WHERE Nombre_Producto_Servicio ILIKE $1';
            queryText += searchClause;
            countQueryText += searchClause;
            queryParams.push(`%${search}%`);
        }

        // Add sorting and pagination
        // Note: IF search exists, parameter index for limit/offset shifts
        const paramOffset = search ? 1 : 0;

        queryText += ` ORDER BY ID_Producto_Servicio DESC LIMIT $${paramOffset + 1} OFFSET $${paramOffset + 2}`;

        const finalParams = search
            ? [queryParams[0], limit, offset]
            : [limit, offset];

        const [productsResult, countResult] = await Promise.all([
            db.query(queryText, finalParams),
            db.query(countQueryText, search ? queryParams : [])
        ]);

        const totalRecords = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalRecords / limit);

        res.json({
            data: productsResult.rows,
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

// Get product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM PRODUCTOS_SERVICIOS WHERE ID_Producto_Servicio = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create Product
const createProduct = async (req, res) => {
    let {
        ID_Producto_Servicio,
        Nombre_Producto_Servicio,
        Descripcion_Producto_Servicio,
        Precio_Unitario_Sugerido,
        Tiempo_Entrega_Proveedor_Dias,
        Stock_Seguridad_Minimo,
        Punto_Reorden,
        Cantidad_Reorden_Optima,
        ID_Unidad_Compra,
        ID_Unidad_Venta,
        ID_Unidad_Base,
        Codigo_Barras,
        Codigo_QR
    } = req.body;

    try {
        // Auto-generate ID if not provided (MAX + 1 pattern)
        if (!ID_Producto_Servicio) {
            const maxResult = await db.query('SELECT MAX(ID_Producto_Servicio) as max_id FROM PRODUCTOS_SERVICIOS');
            ID_Producto_Servicio = (parseInt(maxResult.rows[0].max_id) || 0) + 1;
        }

        // Set defaults for mandatory unit IDs if not provided
        ID_Unidad_Base = ID_Unidad_Base || 3;   // Default to 'Unidad'
        ID_Unidad_Compra = ID_Unidad_Compra || 3;
        ID_Unidad_Venta = ID_Unidad_Venta || 3;

        const query = `
      INSERT INTO PRODUCTOS_SERVICIOS (
        ID_Producto_Servicio, Nombre_Producto_Servicio, Descripcion_Producto_Servicio,
        Precio_Unitario_Sugerido, Tiempo_Entrega_Proveedor_Dias, Stock_Seguridad_Minimo,
        Punto_Reorden, Cantidad_Reorden_Optima, ID_Unidad_Compra, ID_Unidad_Venta,
        ID_Unidad_Base, Codigo_Barras, Codigo_QR
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
        const values = [
            ID_Producto_Servicio, Nombre_Producto_Servicio, Descripcion_Producto_Servicio,
            Precio_Unitario_Sugerido, Tiempo_Entrega_Proveedor_Dias, Stock_Seguridad_Minimo,
            Punto_Reorden, Cantidad_Reorden_Optima, ID_Unidad_Compra, ID_Unidad_Venta,
            ID_Unidad_Base, Codigo_Barras, Codigo_QR
        ];

        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const {
        Nombre_Producto_Servicio,
        Descripcion_Producto_Servicio,
        Precio_Unitario_Sugerido,
        Tiempo_Entrega_Proveedor_Dias,
        Stock_Seguridad_Minimo,
        Punto_Reorden,
        Cantidad_Reorden_Optima,
        ID_Unidad_Compra,
        ID_Unidad_Venta,
        ID_Unidad_Base,
        Codigo_Barras,
        Codigo_QR
    } = req.body;

    try {
        const query = `
      UPDATE PRODUCTOS_SERVICIOS SET
        Nombre_Producto_Servicio = $1, Descripcion_Producto_Servicio = $2,
        Precio_Unitario_Sugerido = $3, Tiempo_Entrega_Proveedor_Dias = $4,
        Stock_Seguridad_Minimo = $5, Punto_Reorden = $6, Cantidad_Reorden_Optima = $7,
        ID_Unidad_Compra = $8, ID_Unidad_Venta = $9, ID_Unidad_Base = $10,
        Codigo_Barras = $11, Codigo_QR = $12
      WHERE ID_Producto_Servicio = $13
      RETURNING *
    `;
        const values = [
            Nombre_Producto_Servicio, Descripcion_Producto_Servicio,
            Precio_Unitario_Sugerido, Tiempo_Entrega_Proveedor_Dias,
            Stock_Seguridad_Minimo, Punto_Reorden, Cantidad_Reorden_Optima,
            ID_Unidad_Compra, ID_Unidad_Venta, ID_Unidad_Base,
            Codigo_Barras, Codigo_QR, id
        ];

        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM PRODUCTOS_SERVICIOS WHERE ID_Producto_Servicio = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
