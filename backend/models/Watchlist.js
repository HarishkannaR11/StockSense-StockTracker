const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    companyName: { type: String, default: '' },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
