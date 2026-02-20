const TransportService = require('@smg/service-layer/src/logistica/transportService');

const getAllTransportOrders = async (req, res) => {
    try {
        const orders = await TransportService.getAllTransportOrders(req.tenantId);
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createTransportOrder = async (req, res) => {
    try {
        const transportOrder = await TransportService.createTransportOrder(req.tenantId, req.body);
        res.status(201).json({ message: 'Transport order created successfully', transportOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

module.exports = { getAllTransportOrders, createTransportOrder };
