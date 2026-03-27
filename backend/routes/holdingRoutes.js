const express = require('express');
const router = express.Router();
const holdingController = require('../controllers/holdingController');

router.get('/market/quote/:symbol', holdingController.getLiveQuote);
router.get('/portfolios/:id/holdings', holdingController.getHoldings);
router.post('/portfolios/:id/holdings', holdingController.addHolding);
router.put('/holdings/:id', holdingController.updateHolding);
router.patch('/holdings/:id/price', holdingController.updatePrice);
router.delete('/holdings/:id', holdingController.deleteHolding);

module.exports = router;
