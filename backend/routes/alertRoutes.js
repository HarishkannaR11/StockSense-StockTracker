const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/portfolios/:id/alerts', alertController.getAlerts);
router.post('/portfolios/:id/alerts', alertController.addAlert);
router.post('/portfolios/:id/alerts/check', alertController.checkAlerts);
router.delete('/alerts/:id', alertController.deleteAlert);

module.exports = router;
