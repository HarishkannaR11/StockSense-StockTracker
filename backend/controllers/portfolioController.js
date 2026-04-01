const Portfolio = require('../models/Portfolio');
const Holding = require('../models/Holding');
const Transaction = require('../models/Transaction');

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

exports.exportPortfolioCsv = async (req, res) => {
    try {
        const portfolioId = req.params.id;
        const portfolio = await Portfolio.findById(portfolioId);
        if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

        const holdings = await Holding.find({ portfolioId });
        const transactions = await Transaction.find({ portfolioId }).sort({ date: -1 });

        const escapeCsv = (value) => {
            const text = value == null ? '' : String(value);
            return `"${text.replace(/"/g, '""')}"`;
        };

        const lines = [];
        lines.push('"SECTION","SYMBOL","COMPANY","QTY","BUY_PRICE","CURRENT_PRICE","INVESTED","CURRENT_VALUE","PNL","DATE","TYPE","PRICE","NOTES"');

        for (const h of holdings) {
            const invested = h.quantity * h.buyPrice;
            const currentValue = h.quantity * h.currentPrice;
            const pnl = currentValue - invested;
            lines.push([
                escapeCsv('HOLDING'),
                escapeCsv(h.symbol),
                escapeCsv(h.companyName),
                escapeCsv(h.quantity),
                escapeCsv(h.buyPrice.toFixed(2)),
                escapeCsv(h.currentPrice.toFixed(2)),
                escapeCsv(invested.toFixed(2)),
                escapeCsv(currentValue.toFixed(2)),
                escapeCsv(pnl.toFixed(2)),
                escapeCsv(''),
                escapeCsv(''),
                escapeCsv(''),
                escapeCsv('')
            ].join(','));
        }

        for (const t of transactions) {
            lines.push([
                escapeCsv('TRANSACTION'),
                escapeCsv(t.symbol),
                escapeCsv(''),
                escapeCsv(t.quantity),
                escapeCsv(''),
                escapeCsv(''),
                escapeCsv(''),
                escapeCsv(''),
                escapeCsv(''),
                escapeCsv(new Date(t.date).toISOString()),
                escapeCsv(t.type),
                escapeCsv(t.price.toFixed(2)),
                escapeCsv(t.notes || '')
            ].join(','));
        }

        const csv = lines.join('\n');
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="portfolio-${portfolioId}.csv"`);
        res.send(csv);
    } catch (err) {
        res.status(500).json({ message: 'Failed to export CSV', error: err.message });
    }
};
