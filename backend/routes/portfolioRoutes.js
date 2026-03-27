const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

router.get('/portfolios/:id', portfolioController.getPortfolio);

module.exports = router;
