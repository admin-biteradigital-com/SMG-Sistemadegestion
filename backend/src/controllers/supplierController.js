const db = require('../config/db');

// Get all suppliers
const getAllSuppliers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM PROVEEDORES');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get supplier by ID
const getSupplierById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM PROVEEDORES WHERE ID_Proveedor = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create Supplier
const createSupplier = async (req, res) => {
    const {
        ID_Proveedor,
        Nombre_Proveedor,
        Contacto_Proveedor,
        Telefono_Proveedor,
        Email_Proveedor,
        Direccion_Proveedor,
        RUT_Proveedor
    } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO PROVEEDORES (ID_Proveedor, Nombre_Proveedor, Contacto_Proveedor, Telefono_Proveedor, Email_Proveedor, Direccion_Proveedor, RUT_Proveedor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [ID_Proveedor, Nombre_Proveedor, Contacto_Proveedor, Telefono_Proveedor, Email_Proveedor, Direccion_Proveedor, RUT_Proveedor]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

// Update Supplier
const updateSupplier = async (req, res) => {
    const { id } = req.params;
    const {
        Nombre_Proveedor,
        Contacto_Proveedor,
        Telefono_Proveedor,
        Email_Proveedor,
        Direccion_Proveedor,
        RUT_Proveedor
    } = req.body;

    try {
        const result = await db.query(
            'UPDATE PROVEEDORES SET Nombre_Proveedor = $1, Contacto_Proveedor = $2, Telefono_Proveedor = $3, Email_Proveedor = $4, Direccion_Proveedor = $5, RUT_Proveedor = $6 WHERE ID_Proveedor = $7 RETURNING *',
            [Nombre_Proveedor, Contacto_Proveedor, Telefono_Proveedor, Email_Proveedor, Direccion_Proveedor, RUT_Proveedor, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete Supplier
const deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM PROVEEDORES WHERE ID_Proveedor = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json({ message: 'Supplier deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};
