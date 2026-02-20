const ReceptionService = require('@smg/service-layer/src/logistica/receptionService');

const getAllReceptions = async (req, res) => {
    try {
        const receptions = await ReceptionService.getAllReceptions(req.tenantId);
        res.json(receptions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createReception = async (req, res) => {
    try {
        const reception = await ReceptionService.createReception(req.tenantId, req.body);
        res.status(201).json({ message: 'Reception created and stock updated successfully', reception });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

module.exports = { getAllReceptions, createReception };
