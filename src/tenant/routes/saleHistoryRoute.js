const express = require('express');
const { getSaleReport} = require('../controllers/saleHistoryController');

const router = express.Router();

// Route for creating a new order
router.post('/', getSaleReport);




module.exports = router;
