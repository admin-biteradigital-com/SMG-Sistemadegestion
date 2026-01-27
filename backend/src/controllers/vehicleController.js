const db = require('../config/db');

// Get all vehicles
const getAllVehicles = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM VEHICULOS');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get vehicle by ID
const getVehicleById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM VEHICULOS WHERE ID_Vehiculo = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create Vehicle
const createVehicle = async (req, res) => {
    const {
        ID_Vehiculo,
        Patente,
        Marca,
        Modelo,
        Ano,
        Tipo_Vehiculo,
        Capacidad_Carga_KG,
        Estado_Vehiculo
    } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO VEHICULOS (ID_Vehiculo, Patente, Marca, Modelo, Ano, Tipo_Vehiculo, Capacidad_Carga_KG, Estado_Vehiculo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [ID_Vehiculo, Patente, Marca, Modelo, Ano, Tipo_Vehiculo, Capacidad_Carga_KG, Estado_Vehiculo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

// Update Vehicle
const updateVehicle = async (req, res) => {
    const { id } = req.params;
    const {
        Patente,
        Marca,
        Modelo,
        Ano,
        Tipo_Vehiculo,
        Capacidad_Carga_KG,
        Estado_Vehiculo
    } = req.body;

    try {
        const result = await db.query(
            'UPDATE VEHICULOS SET Patente = $1, Marca = $2, Modelo = $3, Ano = $4, Tipo_Vehiculo = $5, Capacidad_Carga_KG = $6, Estado_Vehiculo = $7 WHERE ID_Vehiculo = $8 RETURNING *',
            [Patente, Marca, Modelo, Ano, Tipo_Vehiculo, Capacidad_Carga_KG, Estado_Vehiculo, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete Vehicle
const deleteVehicle = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM VEHICULOS WHERE ID_Vehiculo = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
};
