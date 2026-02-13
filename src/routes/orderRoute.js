const express = require('express');
const { createOrder, getOrders,getOrder,updateOrder,receivePayment,createReceipt} = require('../controllers/orderController');

const router = express.Router();

// Route for creating a new order
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.put('/:id/recieve-payment', receivePayment);
router.post('/:id/print-receipt', createReceipt);
router.get('/:id', getOrder);
router.get('/', getOrders);




module.exports = router;
