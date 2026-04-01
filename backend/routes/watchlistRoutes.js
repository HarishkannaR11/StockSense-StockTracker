const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

router.get('/watchlist', watchlistController.getWatchlist);
router.post('/watchlist', watchlistController.addWatchlistItem);
router.delete('/watchlist/:id', watchlistController.deleteWatchlistItem);

module.exports = router;
