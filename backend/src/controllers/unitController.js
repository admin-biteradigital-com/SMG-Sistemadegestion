const db = require('../config/db');

const getAllUnits = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM UNIDADES_MEDIDA');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getUnitById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM UNIDADES_MEDIDA WHERE ID_Unidad = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Unit not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createUnit = async (req, res) => {
    const { ID_Unidad, Nombre_Unidad, Abreviatura, Tipo_Unidad } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO UNIDADES_MEDIDA (ID_Unidad, Nombre_Unidad, Abreviatura, Tipo_Unidad) VALUES ($1, $2, $3, $4) RETURNING *',
            [ID_Unidad, Nombre_Unidad, Abreviatura, Tipo_Unidad]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateUnit = async (req, res) => {
    const { id } = req.params;
    const { Nombre_Unidad, Abreviatura, Tipo_Unidad } = req.body;
    try {
        const result = await db.query(
            'UPDATE UNIDADES_MEDIDA SET Nombre_Unidad = $1, Abreviatura = $2, Tipo_Unidad = $3 WHERE ID_Unidad = $4 RETURNING *',
            [Nombre_Unidad, Abreviatura, Tipo_Unidad, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Unit not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteUnit = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM UNIDADES_MEDIDA WHERE ID_Unidad = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Unit not found' });
        }
        res.json({ message: 'Unit deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllUnits,
    getUnitById,
    createUnit,
    updateUnit,
    deleteUnit,
};
