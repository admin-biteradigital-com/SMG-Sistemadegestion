const StockService = require('@smg/service-layer/src/logistica/stockService');

const getAllStock = async (req, res) => {
    try {
        const stock = await StockService.getAllStock(req.tenantId);
        res.json(stock);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getAllStock };
