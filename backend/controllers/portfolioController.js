const Portfolio = require('../models/Portfolio');
const Holding = require('../models/Holding');

exports.getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

        const holdings = await Holding.find({ portfolioId: req.params.id });

        let totalInvested = 0;
        let currentValue = 0;

        holdings.forEach(h => {
            totalInvested += h.quantity * h.buyPrice;
            currentValue += h.quantity * h.currentPrice;
        });

        const totalPnL = currentValue - totalInvested;
        const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

        res.json({
            portfolio,
            holdings,
            summary: { totalInvested, currentValue, totalPnL, pnlPercent }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
