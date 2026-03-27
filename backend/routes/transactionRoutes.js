const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/portfolios/:id/transactions', transactionController.getTransactions);
router.post('/portfolios/:id/transactions', transactionController.addTransaction);
router.delete('/transactions/:id', transactionController.deleteTransaction);

module.exports = router;
