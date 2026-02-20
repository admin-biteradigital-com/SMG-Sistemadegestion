const UnitService = require('@smg/service-layer/src/logistica/unitService');

const getAllUnits = async (req, res) => {
    try {
        const tenantId = req.tenantId; // Inyectado por middleware global
        const units = await UnitService.getAllUnits(tenantId);
        res.json(units);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getUnitById = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const unit = await UnitService.getUnitById(tenantId, id);
        if (!unit) {
            return res.status(404).json({ error: 'Unit not found' });
        }
        res.json(unit);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createUnit = async (req, res) => {
    const tenantId = req.tenantId;
    try {
        const unit = await UnitService.createUnit(tenantId, req.body);
        res.status(201).json(unit);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const updateUnit = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const unit = await UnitService.updateUnit(tenantId, id, req.body);
        if (!unit) {
            return res.status(404).json({ error: 'Unit not found' });
        }
        res.json(unit);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteUnit = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId;
    try {
        const unit = await UnitService.deleteUnit(tenantId, id);
        if (!unit) {
            return res.status(404).json({ error: 'Unit not found' });
        }
        res.json({ message: 'Unit deleted successfully', payload: unit });
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
