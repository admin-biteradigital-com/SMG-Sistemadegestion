const EmployeeService = require('@smg/service-layer/src/logistica/employeeService');

const getAllEmployees = async (req, res) => {
    try {
        const tenantId = req.tenantId; // Inyectado por middleware global
        const employees = await EmployeeService.getAllEmployees(tenantId);
        res.json(employees);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const employee = await EmployeeService.getEmployeeById(tenantId, id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createEmployee = async (req, res) => {
    const tenantId = req.tenantId;
    try {
        const employee = await EmployeeService.createEmployee(tenantId, req.body);
        res.status(201).json(employee);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const employee = await EmployeeService.updateEmployee(tenantId, id, req.body);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const employee = await EmployeeService.deleteEmployee(tenantId, id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully', payload: employee });
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
