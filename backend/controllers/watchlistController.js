const Watchlist = require('../models/Watchlist');

exports.getWatchlist = async (req, res) => {
    try {
        const items = await Watchlist.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load watchlist', error: err.message });
    }
};

exports.addWatchlistItem = async (req, res) => {
    try {
        const symbol = (req.body.symbol || '').trim().toUpperCase();
        if (!symbol) return res.status(400).json({ message: 'Symbol is required' });

        const item = await Watchlist.create({
            userId: req.userId,
            symbol,
            companyName: req.body.companyName || '',
            notes: req.body.notes || ''
        });

        res.status(201).json(item);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Symbol already in watchlist' });
        }
        res.status(400).json({ message: 'Failed to add watchlist item', error: err.message });
    }
};

exports.deleteWatchlistItem = async (req, res) => {
    try {
        const item = await Watchlist.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!item) return res.status(404).json({ message: 'Watchlist item not found' });
        res.json({ message: 'Watchlist item removed' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete watchlist item', error: err.message });
    }
};
