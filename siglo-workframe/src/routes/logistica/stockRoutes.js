const express = require('express');
const router = express.Router();
const stockController = require('../../controllers/logistica/stockController');

router.get('/', stockController.getAllStock);

module.exports = router;
