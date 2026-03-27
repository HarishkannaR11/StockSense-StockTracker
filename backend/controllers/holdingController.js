const Holding = require('../models/Holding');
const Transaction = require('../models/Transaction');

const fetchChartMeta = async (providerSymbol) => {
    const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(providerSymbol)}?range=1d&interval=1d`;
    const chartRes = await fetch(chartUrl, {
        headers: {
            'User-Agent': 'StockSense/1.0'
        }
    });

    if (!chartRes.ok) return null;

    const chartPayload = await chartRes.json();
    const meta = chartPayload?.chart?.result?.[0]?.meta;
    if (!meta || typeof meta.regularMarketPrice !== 'number') return null;
    return meta;
};

const resolveLiveQuote = async (rawInputSymbol) => {
    const rawSymbol = (rawInputSymbol || '').trim().toUpperCase();
    if (!rawSymbol) return null;

    const primaryCandidates = [rawSymbol, `${rawSymbol}.NS`, `${rawSymbol}.BO`];
    let selectedSymbol = null;
    let selectedMeta = null;

    for (const candidate of primaryCandidates) {
        const meta = await fetchChartMeta(candidate);
        if (meta) {
            selectedSymbol = meta.symbol || candidate;
            selectedMeta = meta;
            break;
        }
    }

    if (!selectedMeta) {
        const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(rawSymbol)}`;
        const searchRes = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'StockSense/1.0'
            }
        });

        if (searchRes.ok) {
            const searchPayload = await searchRes.json();
            const quotes = searchPayload?.quotes || [];

            const ranked = quotes
                .filter(item => item?.symbol && item?.quoteType === 'EQUITY')
                .sort((a, b) => {
                    const aIndian = String(a.exchange || '').includes('NSI') || String(a.exchange || '').includes('BSE');
                    const bIndian = String(b.exchange || '').includes('NSI') || String(b.exchange || '').includes('BSE');
                    if (aIndian && !bIndian) return -1;
                    if (!aIndian && bIndian) return 1;
                    return (b.score || 0) - (a.score || 0);
                });

            for (const item of ranked) {
                const meta = await fetchChartMeta(item.symbol);
                if (meta) {
                    selectedSymbol = item.symbol;
                    selectedMeta = meta;
                    break;
                }
            }
        }
    }

    if (!selectedMeta) return null;

    return {
        symbol: rawSymbol,
        providerSymbol: selectedSymbol,
        companyName: selectedMeta.longName || selectedMeta.shortName || rawSymbol,
        currentPrice: selectedMeta.regularMarketPrice,
        currency: selectedMeta.currency || 'INR',
        marketState: selectedMeta.marketState || 'UNKNOWN'
    };
};

exports.getLiveQuote = async (req, res) => {
    try {
        const rawSymbol = req.params.symbol;

        if (!rawSymbol || !String(rawSymbol).trim()) {
            return res.status(400).json({ message: 'Symbol is required' });
        }
        const quote = await resolveLiveQuote(rawSymbol);
        if (!quote) {
            return res.status(404).json({ message: 'No live quote found for this symbol' });
        }

        return res.json(quote);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch quote', error: err.message });
    }
};

exports.refreshPortfolioPrices = async (req, res) => {
    try {
        const portfolioId = req.params.id;
        const holdings = await Holding.find({ portfolioId });

        if (!holdings.length) {
            return res.json({ updated: 0, failed: 0, holdings: [] });
        }

        let updated = 0;
        let failed = 0;

        for (const holding of holdings) {
            try {
                const quote = await resolveLiveQuote(holding.symbol);
                if (quote && typeof quote.currentPrice === 'number') {
                    holding.currentPrice = quote.currentPrice;
                    await holding.save();
                    updated += 1;
                } else {
                    failed += 1;
                }
            } catch (error) {
                failed += 1;
            }
        }

        const refreshed = await Holding.find({ portfolioId });
        return res.json({ updated, failed, holdings: refreshed });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to refresh prices', error: err.message });
    }
};

exports.getHoldings = async (req, res) => {
    try {
        const holdings = await Holding.find({ portfolioId: req.params.id });
        res.json(holdings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addHolding = async (req, res) => {
    try {
        const hData = { ...req.body, portfolioId: req.params.id };
        const holding = await Holding.create(hData);

        await Transaction.create({
            portfolioId: req.params.id,
            symbol: holding.symbol,
            type: 'BUY',
            quantity: holding.quantity,
            price: holding.buyPrice,
            date: holding.buyDate || Date.now()
        });

        res.status(201).json(holding);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateHolding = async (req, res) => {
    try {
        const holding = await Holding.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(holding);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updatePrice = async (req, res) => {
    try {
        const holding = await Holding.findByIdAndUpdate(req.params.id, { currentPrice: req.body.currentPrice }, { new: true });
        res.json(holding);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteHolding = async (req, res) => {
    try {
        await Holding.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted holding' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
