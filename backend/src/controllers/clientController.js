const db = require('../config/db');

// Get all clients
const getAllClients = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM CLIENTES');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get client by ID
const getClientById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM CLIENTES WHERE ID_Cliente = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create Client
const createClient = async (req, res) => {
    const {
        ID_Cliente,
        Razon_Social,
        RUT_Cliente,
        Ciclo_Reabastecimiento_Dias,
        Limite_Credito_Autorizado,
        Segmento_Cliente
    } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO CLIENTES (ID_Cliente, Razon_Social, RUT_Cliente, Ciclo_Reabastecimiento_Dias, Limite_Credito_Autorizado, Segmento_Cliente) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [ID_Cliente, Razon_Social, RUT_Cliente, Ciclo_Reabastecimiento_Dias, Limite_Credito_Autorizado, Segmento_Cliente]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

// Update Client
const updateClient = async (req, res) => {
    const { id } = req.params;
    const {
        Razon_Social,
        RUT_Cliente,
        Ciclo_Reabastecimiento_Dias,
        Limite_Credito_Autorizado,
        Segmento_Cliente
    } = req.body;

    try {
        const result = await db.query(
            'UPDATE CLIENTES SET Razon_Social = $1, RUT_Cliente = $2, Ciclo_Reabastecimiento_Dias = $3, Limite_Credito_Autorizado = $4, Segmento_Cliente = $5 WHERE ID_Cliente = $6 RETURNING *',
            [Razon_Social, RUT_Cliente, Ciclo_Reabastecimiento_Dias, Limite_Credito_Autorizado, Segmento_Cliente, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete Client
const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM CLIENTES WHERE ID_Cliente = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json({ message: 'Client deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
};
