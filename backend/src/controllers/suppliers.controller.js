const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

// GET all suppliers
const getSuppliers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM PROVEEDORES ORDER BY ID_Proveedor ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// GET single supplier by ID
const getSupplierById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM PROVEEDORES WHERE ID_Proveedor = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching supplier:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// CREATE new supplier
const createSupplier = async (req, res) => {
    const { ID_Proveedor, Nombre_Proveedor, Contacto_Proveedor, Telefono_Proveedor, Email_Proveedor, Direccion_Proveedor, RUT_Proveedor } = req.body;

    try {
        // If ID_Proveedor is not provided, we might need to handle it depending on DB setup (Identity/Serial vs Manual).
        // The current schema treats IDs as manual inputs in seed, but typically we'd want auto-increment.
        // For now, let's assume we need to calculate the next ID if not provided, OR rely on user input.
        // Given the seed data had manual IDs, I'll first check if we can get the max ID.

        let nextId = ID_Proveedor;
        if (!nextId) {
            const maxIdResult = await pool.query('SELECT MAX(ID_Proveedor) as max_id FROM PROVEEDORES');
            nextId = (maxIdResult.rows[0].max_id || 0) + 1;
        }

        const result = await pool.query(
            `INSERT INTO PROVEEDORES (ID_Proveedor, Nombre_Proveedor, Contacto_Proveedor, Telefono_Proveedor, Email_Proveedor, Direccion_Proveedor, RUT_Proveedor)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [nextId, Nombre_Proveedor, Contacto_Proveedor, Telefono_Proveedor, Email_Proveedor, Direccion_Proveedor, RUT_Proveedor]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// UPDATE supplier
const updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { Nombre_Proveedor, Contacto_Proveedor, Telefono_Proveedor, Email_Proveedor, Direccion_Proveedor, RUT_Proveedor } = req.body;

    try {
        const result = await pool.query(
            `UPDATE PROVEEDORES 
       SET Nombre_Proveedor = $1, Contacto_Proveedor = $2, Telefono_Proveedor = $3, Email_Proveedor = $4, Direccion_Proveedor = $5, RUT_Proveedor = $6
       WHERE ID_Proveedor = $7
       RETURNING *`,
            [Nombre_Proveedor, Contacto_Proveedor, Telefono_Proveedor, Email_Proveedor, Direccion_Proveedor, RUT_Proveedor, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// DELETE supplier
const deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM PROVEEDORES WHERE ID_Proveedor = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        if (error.code === '23503') { // Foreign key violation
            return res.status(400).json({ error: 'Cannot delete supplier with existing dependencies (e.g., Purchase Orders).' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
