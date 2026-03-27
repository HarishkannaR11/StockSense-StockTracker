require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const holdingRoutes = require('./routes/holdingRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const { protect } = require('./middleware/authMiddleware');

const app = express();

mongoose.set('bufferCommands', false);

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
    }
};

connectDB();

app.use('/api', (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: 'Database unavailable. Check MongoDB connection and try again.'
        });
    }
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api', protect, portfolioRoutes);
app.use('/api', protect, holdingRoutes);
app.use('/api', protect, transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
