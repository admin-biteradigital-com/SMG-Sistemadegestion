const express = require('express');
const router = express.Router();
const loadController = require('../controllers/loadController');

router.get('/', loadController.getAllLoadOrders);
router.post('/', loadController.createLoadOrder);

module.exports = router;
