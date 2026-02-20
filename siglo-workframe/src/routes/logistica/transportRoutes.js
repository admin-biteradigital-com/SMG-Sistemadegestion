const express = require('express');
const router = express.Router();
const transportController = require('../../controllers/logistica/transportController');

router.get('/', transportController.getAllTransportOrders);
router.post('/', transportController.createTransportOrder);

module.exports = router;
