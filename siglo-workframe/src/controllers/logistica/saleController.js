const SaleService = require('@smg/service-layer/src/logistica/saleService');

const getAllSales = async (req, res) => {
    try {
        const sales = await SaleService.getAllSales(req.tenantId);
        res.json(sales);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createSale = async (req, res) => {
    try {
        const sale = await SaleService.createSale(req.tenantId, req.body);
        res.status(201).json({ message: 'Sale created successfully', sale });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const registerPayment = async (req, res) => {
    try {
        const payment = await SaleService.registerPayment(req.tenantId, req.body);
        res.status(201).json({ message: 'Payment registered successfully', payment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

module.exports = { getAllSales, createSale, registerPayment };
