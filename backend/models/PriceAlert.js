const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    condition: { type: String, enum: ['ABOVE', 'BELOW'], required: true },
    targetPrice: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    triggeredAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
