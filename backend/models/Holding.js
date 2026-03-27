const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
    portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    companyName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    buyPrice: { type: Number, required: true, min: 0 },
    buyDate: { type: Date, required: true },
    currentPrice: { type: Number, required: true, min: 0 }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

holdingSchema.virtual('pnl').get(function () {
    return (this.currentPrice - this.buyPrice) * this.quantity;
});
holdingSchema.virtual('pnlPercent').get(function () {
    if (this.buyPrice === 0) return 0;
    return ((this.currentPrice - this.buyPrice) / this.buyPrice) * 100;
});
holdingSchema.virtual('currentValue').get(function () {
    return this.currentPrice * this.quantity;
});
holdingSchema.virtual('invested').get(function () {
    return this.buyPrice * this.quantity;
});

module.exports = mongoose.model('Holding', holdingSchema);
