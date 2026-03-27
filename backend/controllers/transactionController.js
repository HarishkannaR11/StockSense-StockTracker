const Transaction = require('../models/Transaction');
const Holding = require('../models/Holding');

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ portfolioId: req.params.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addTransaction = async (req, res) => {
    try {
        const portfolioId = req.params.id;
        const symbol = (req.body.symbol || '').trim().toUpperCase();
        const type = (req.body.type || '').trim().toUpperCase();
        const quantity = Number(req.body.quantity);
        const price = Number(req.body.price);
        const date = req.body.date ? new Date(req.body.date) : new Date();
        const notes = req.body.notes || '';
        const companyName = req.body.companyName || symbol;

        if (!symbol || !['BUY', 'SELL'].includes(type) || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(price) || price < 0) {
            return res.status(400).json({ message: 'Invalid transaction input' });
        }

        let holding = await Holding.findOne({ portfolioId, symbol });

        if (type === 'BUY') {
            if (!holding) {
                holding = await Holding.create({
                    portfolioId,
                    symbol,
                    companyName,
                    quantity,
                    buyPrice: price,
                    buyDate: date,
                    currentPrice: price
                });
            } else {
                const totalInvested = (holding.buyPrice * holding.quantity) + (price * quantity);
                const newQuantity = holding.quantity + quantity;
                holding.quantity = newQuantity;
                holding.buyPrice = totalInvested / newQuantity;
                holding.currentPrice = price;
                if (!holding.companyName) holding.companyName = companyName;
                await holding.save();
            }
        }

        if (type === 'SELL') {
            if (!holding) {
                return res.status(400).json({ message: `No holding found for ${symbol}` });
            }
            if (quantity > holding.quantity) {
                return res.status(400).json({ message: `Cannot sell ${quantity}. Available quantity is ${holding.quantity}` });
            }

            const remaining = holding.quantity - quantity;
            if (remaining === 0) {
                await Holding.findByIdAndDelete(holding._id);
            } else {
                holding.quantity = remaining;
                holding.currentPrice = price;
                await holding.save();
            }
        }

        const transaction = await Transaction.create({ portfolioId, symbol, type, quantity, price, date, notes });
        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted transaction' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
