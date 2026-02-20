const PurchaseOrderService = require('@smg/service-layer/src/logistica/purchaseOrderService');

const getAllPurchaseOrders = async (req, res) => {
    try {
        const orders = await PurchaseOrderService.getAllPurchaseOrders(req.tenantId);
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getPurchaseOrderById = async (req, res) => {
    try {
        const order = await PurchaseOrderService.getPurchaseOrderById(req.tenantId, req.params.id);
        if (!order) return res.status(404).json({ error: 'Purchase order not found' });
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createPurchaseOrder = async (req, res) => {
    try {
        const result = await PurchaseOrderService.createPurchaseOrder(req.tenantId, req.body);
        res.status(201).json({ message: 'Purchase order created successfully', ...result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const updatePurchaseOrderStatus = async (req, res) => {
    try {
        const order = await PurchaseOrderService.updatePurchaseOrderStatus(req.tenantId, req.params.id, req.body.Estado_Orden);
        if (!order) return res.status(404).json({ error: 'Purchase order not found' });
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getAllPurchaseOrders, getPurchaseOrderById, createPurchaseOrder, updatePurchaseOrderStatus };
