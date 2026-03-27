const Transaction = require('../models/Transaction');

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
        const transaction = await Transaction.create({ ...req.body, portfolioId: req.params.id });
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
