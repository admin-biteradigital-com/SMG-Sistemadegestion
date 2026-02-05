const express = require('express');
const router = express.Router();
const siiController = require('../controllers/siiController');

// Rutas de Autenticación SII
router.post('/auth/token', siiController.getSiiToken);

// Gestión de Folios
router.post('/caf/upload', siiController.uploadCaf); // Debería aceptar multipart/form-data

// Operación DTE
router.post('/dte/generate', siiController.generateDte);
router.post('/dte/send', siiController.sendDteToSii);

module.exports = router;
