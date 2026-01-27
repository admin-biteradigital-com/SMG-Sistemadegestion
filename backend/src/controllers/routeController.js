const db = require('../config/db');

// Get all routes
const getAllRoutes = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM RUTAS');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get route by ID
const getRouteById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM RUTAS WHERE ID_Ruta = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Route not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create Route
const createRoute = async (req, res) => {
    const {
        ID_Ruta,
        Nombre_Ruta,
        Descripcion_Ruta,
        Distancia_Estimada_KM,
        Duracion_Estimada_Horas
    } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO RUTAS (ID_Ruta, Nombre_Ruta, Descripcion_Ruta, Distancia_Estimada_KM, Duracion_Estimada_Horas) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [ID_Ruta, Nombre_Ruta, Descripcion_Ruta, Distancia_Estimada_KM, Duracion_Estimada_Horas]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

// Update Route
const updateRoute = async (req, res) => {
    const { id } = req.params;
    const {
        Nombre_Ruta,
        Descripcion_Ruta,
        Distancia_Estimada_KM,
        Duracion_Estimada_Horas
    } = req.body;

    try {
        const result = await db.query(
            'UPDATE RUTAS SET Nombre_Ruta = $1, Descripcion_Ruta = $2, Distancia_Estimada_KM = $3, Duracion_Estimada_Horas = $4 WHERE ID_Ruta = $5 RETURNING *',
            [Nombre_Ruta, Descripcion_Ruta, Distancia_Estimada_KM, Duracion_Estimada_Horas, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Route not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete Route
const deleteRoute = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM RUTAS WHERE ID_Ruta = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Route not found' });
        }
        res.json({ message: 'Route deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllRoutes,
    getRouteById,
    createRoute,
    updateRoute,
    deleteRoute,
};
