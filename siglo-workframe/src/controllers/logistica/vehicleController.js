const VehicleService = require('@smg/service-layer/src/logistica/vehicleService');

const getAllVehicles = async (req, res) => {
    try {
        const tenantId = req.tenantId; // Inyectado por middleware global
        const vehicles = await VehicleService.getAllVehicles(tenantId);
        res.json(vehicles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getVehicleById = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const vehicle = await VehicleService.getVehicleById(tenantId, id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createVehicle = async (req, res) => {
    const tenantId = req.tenantId;
    try {
        const vehicle = await VehicleService.createVehicle(tenantId, req.body);
        res.status(201).json(vehicle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const updateVehicle = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const vehicle = await VehicleService.updateVehicle(tenantId, id, req.body);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteVehicle = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const vehicle = await VehicleService.deleteVehicle(tenantId, id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted successfully', payload: vehicle });
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
