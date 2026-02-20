const express = require('express');
const router = express.Router();
const catalogoController = require('../../controllers/catalogo/catalogoController');

// Rutas de catálogo (ReadOnly public)
router.get('/', catalogoController.getPublicProducts);
router.get('/:id', catalogoController.getPublicProductById);

module.exports = router;
