const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const isDbUnavailableError = (err) => {
    const message = err?.message || '';
    return message.includes('buffering timed out') || message.includes('Client must be connected');
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });
        const portfolio = await Portfolio.create({ userId: user._id, name: 'My Portfolio' });

        res.status(201).json({
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email },
            portfolioId: portfolio._id
        });
    } catch (err) {
        if (isDbUnavailableError(err)) {
            return res.status(503).json({ message: 'Database unavailable. Please try again shortly.' });
        }
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const portfolio = await Portfolio.findOne({ userId: user._id });
            res.json({
                token: generateToken(user._id),
                user: { id: user._id, name: user.name, email: user.email },
                portfolioId: portfolio ? portfolio._id : null
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        if (isDbUnavailableError(err)) {
            return res.status(503).json({ message: 'Database unavailable. Please try again shortly.' });
        }
        res.status(500).json({ error: err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        const portfolio = await Portfolio.findOne({ userId: req.userId });
        res.json({
            user: { id: user._id, name: user.name, email: user.email },
            portfolioId: portfolio ? portfolio._id : null
        });
    } catch (err) {
        if (isDbUnavailableError(err)) {
            return res.status(503).json({ message: 'Database unavailable. Please try again shortly.' });
        }
        res.status(500).json({ error: err.message });
    }
};
