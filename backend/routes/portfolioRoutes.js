const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

router.get('/portfolios/:id', portfolioController.getPortfolio);
router.get('/portfolios/:id/export/csv', portfolioController.exportPortfolioCsv);

module.exports = router;
