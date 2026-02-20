const LoadOrderService = require('@smg/service-layer/src/logistica/loadOrderService');

const getAllLoadOrders = async (req, res) => {
    try {
        const orders = await LoadOrderService.getAllLoadOrders(req.tenantId);
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createLoadOrder = async (req, res) => {
    try {
        const loadOrder = await LoadOrderService.createLoadOrder(req.tenantId, req.body);
        res.status(201).json({ message: 'Load order created and stock decremented successfully', loadOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

module.exports = { getAllLoadOrders, createLoadOrder };
