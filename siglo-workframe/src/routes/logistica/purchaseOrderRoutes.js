const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../../controllers/logistica/purchaseOrderController');

router.get('/', purchaseOrderController.getAllPurchaseOrders);
router.get('/:id', purchaseOrderController.getPurchaseOrderById);
router.post('/', purchaseOrderController.createPurchaseOrder);
router.patch('/:id/status', purchaseOrderController.updatePurchaseOrderStatus);

module.exports = router;
