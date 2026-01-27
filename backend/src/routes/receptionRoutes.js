const express = require('express');
const router = express.Router();
const receptionController = require('../controllers/receptionController');

router.get('/', receptionController.getAllReceptions);
router.post('/', receptionController.createReception);

module.exports = router;
