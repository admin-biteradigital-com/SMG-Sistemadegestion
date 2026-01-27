const db = require('../config/db');

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM EMPLEADOS');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM EMPLEADOS WHERE ID_Empleado = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create Employee
const createEmployee = async (req, res) => {
    const {
        ID_Empleado,
        Nombres,
        Apellidos,
        RUT_Empleado,
        Fecha_Nacimiento,
        Telefono,
        Email,
        Fecha_Contratacion,
        Cargo
    } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO EMPLEADOS (ID_Empleado, Nombres, Apellidos, RUT_Empleado, Fecha_Nacimiento, Telefono, Email, Fecha_Contratacion, Cargo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [ID_Empleado, Nombres, Apellidos, RUT_Empleado, Fecha_Nacimiento, Telefono, Email, Fecha_Contratacion, Cargo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

// Update Employee
const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const {
        Nombres,
        Apellidos,
        RUT_Empleado,
        Fecha_Nacimiento,
        Telefono,
        Email,
        Fecha_Contratacion,
        Cargo
    } = req.body;

    try {
        const result = await db.query(
            'UPDATE EMPLEADOS SET Nombres = $1, Apellidos = $2, RUT_Empleado = $3, Fecha_Nacimiento = $4, Telefono = $5, Email = $6, Fecha_Contratacion = $7, Cargo = $8 WHERE ID_Empleado = $9 RETURNING *',
            [Nombres, Apellidos, RUT_Empleado, Fecha_Nacimiento, Telefono, Email, Fecha_Contratacion, Cargo, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM EMPLEADOS WHERE ID_Empleado = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};
