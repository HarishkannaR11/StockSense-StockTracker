const PriceAlert = require('../models/PriceAlert');
const { resolveLiveQuote } = require('./holdingController');

exports.getAlerts = async (req, res) => {
    try {
        const alerts = await PriceAlert.find({ userId: req.userId, portfolioId: req.params.id }).sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load alerts', error: err.message });
    }
};

exports.addAlert = async (req, res) => {
    try {
        const symbol = (req.body.symbol || '').trim().toUpperCase();
        const condition = (req.body.condition || '').trim().toUpperCase();
        const targetPrice = Number(req.body.targetPrice);

        if (!symbol || !['ABOVE', 'BELOW'].includes(condition) || !Number.isFinite(targetPrice)) {
            return res.status(400).json({ message: 'Invalid alert input' });
        }

        const alert = await PriceAlert.create({
            userId: req.userId,
            portfolioId: req.params.id,
            symbol,
            condition,
            targetPrice,
            isActive: true
        });

        res.status(201).json(alert);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create alert', error: err.message });
    }
};

exports.deleteAlert = async (req, res) => {
    try {
        const deleted = await PriceAlert.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!deleted) return res.status(404).json({ message: 'Alert not found' });
        res.json({ message: 'Alert deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete alert', error: err.message });
    }
};

exports.checkAlerts = async (req, res) => {
    try {
        const alerts = await PriceAlert.find({ userId: req.userId, portfolioId: req.params.id, isActive: true });
        const triggered = [];

        for (const alert of alerts) {
            const quote = await resolveLiveQuote(alert.symbol);
            if (!quote || typeof quote.currentPrice !== 'number') continue;

            const price = quote.currentPrice;
            const hitAbove = alert.condition === 'ABOVE' && price >= alert.targetPrice;
            const hitBelow = alert.condition === 'BELOW' && price <= alert.targetPrice;

            if (hitAbove || hitBelow) {
                alert.isActive = false;
                alert.triggeredAt = new Date();
                await alert.save();
                triggered.push({
                    id: alert._id,
                    symbol: alert.symbol,
                    condition: alert.condition,
                    targetPrice: alert.targetPrice,
                    currentPrice: price
                });
            }
        }

        res.json({ triggeredCount: triggered.length, triggered });
    } catch (err) {
        res.status(500).json({ message: 'Failed to check alerts', error: err.message });
    }
};
