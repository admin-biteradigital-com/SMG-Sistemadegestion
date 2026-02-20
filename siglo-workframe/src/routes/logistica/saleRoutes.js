const express = require('express');
const router = express.Router();
const saleController = require('../../controllers/logistica/saleController');

router.get('/', saleController.getAllSales);
router.post('/', saleController.createSale);
router.post('/payment', saleController.registerPayment);

module.exports = router;
