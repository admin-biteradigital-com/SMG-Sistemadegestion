const express = require('express');
const router = express.Router();
const loadOrderController = require('../../controllers/logistica/loadOrderController');

router.get('/', loadOrderController.getAllLoadOrders);
router.post('/', loadOrderController.createLoadOrder);

module.exports = router;
