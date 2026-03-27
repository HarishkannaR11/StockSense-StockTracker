import { useEffect, useState } from 'react';
import AddHoldingModal from '../components/AddHoldingModal';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { deleteHolding, getHoldings, refreshPortfolioPrices } from '../services/api';

const Holdings = () => {
    const { portfolioId } = useAuth();
    const [holdings, setHoldings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [refreshingPrices, setRefreshingPrices] = useState(false);

    const fetchHoldings = async () => {
        if (!portfolioId) return;
        try {
            const res = await getHoldings(portfolioId);
            setHoldings(res.data);
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to load holdings' });
        }
    };

    const handleRefreshPrices = async (silent = false) => {
        if (!portfolioId) return;
        try {
            if (!silent) setRefreshingPrices(true);
            const res = await refreshPortfolioPrices(portfolioId);
            setHoldings(res.data.holdings || []);
            if (!silent) {
                setToast({ type: 'success', message: `Live prices updated (${res.data.updated} updated)` });
            }
        } catch (err) {
            if (!silent) {
                setToast({ type: 'error', message: err.response?.data?.message || 'Failed to refresh live prices' });
            }
        } finally {
            if (!silent) setRefreshingPrices(false);
        }
    };

    useEffect(() => {
        fetchHoldings();
        const intervalId = setInterval(() => {
            handleRefreshPrices(true);
        }, 60000);

        return () => clearInterval(intervalId);
    }, [portfolioId]);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this holding?')) {
            try {
                await deleteHolding(id);
                setToast({ type: 'success', message: 'Holding deleted' });
                fetchHoldings();
            } catch (err) {
                setToast({ type: 'error', message: err.response?.data?.message || 'Delete failed' });
            }
        }
    };

    return (
        <div>
            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Holdings</h1>
                    <p className="mt-1 text-sm text-gray-500">Track all your current positions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleRefreshPrices(false)}
                        disabled={refreshingPrices}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {refreshingPrices ? 'Refreshing...' : 'Refresh Live'}
                    </button>
                    <button onClick={() => setShowModal(true)} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                        Add Stock
                    </button>
                </div>
            </div>

            <p className="mb-4 text-xs text-gray-500">Auto-updating live prices every 60 seconds.</p>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-4 font-semibold">Symbol</th>
                            <th className="p-4 font-semibold">Company</th>
                            <th className="p-4 font-semibold">Qty</th>
                            <th className="p-4 font-semibold">Buy Price</th>
                            <th className="p-4 font-semibold">Current Price</th>
                            <th className="p-4 font-semibold">Invested</th>
                            <th className="p-4 font-semibold">Current Value</th>
                            <th className="p-4 font-semibold">P&amp;L (₹)</th>
                            <th className="p-4 font-semibold">P&amp;L %</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holdings.map((h) => {
                            const isProfit = h.pnl >= 0;
                            return (
                                <tr key={h._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 font-semibold text-gray-900">{h.symbol}</td>
                                    <td className="p-4 text-gray-700">{h.companyName}</td>
                                    <td className="p-4 text-gray-700">{h.quantity}</td>
                                    <td className="p-4 text-gray-700">₹{h.buyPrice.toFixed(2)}</td>
                                    <td className="p-4 text-gray-700">₹{h.currentPrice.toFixed(2)}</td>
                                    <td className="p-4 text-gray-700">₹{h.invested.toFixed(2)}</td>
                                    <td className="p-4 text-gray-700">₹{h.currentValue.toFixed(2)}</td>
                                    <td className={`p-4 font-semibold ${isProfit ? 'text-green-600' : 'text-red-500'}`}>
                                        {isProfit ? '+' : ''}{h.pnl.toFixed(2)}
                                    </td>
                                    <td className={`p-4 font-semibold ${isProfit ? 'text-green-600' : 'text-red-500'}`}>
                                        {isProfit ? '+' : ''}{h.pnlPercent.toFixed(2)}%
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => handleDelete(h._id)} className="text-red-500 hover:underline font-medium">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                        {holdings.length === 0 && (
                            <tr><td colSpan="10" className="p-8 text-center text-sm text-gray-500">No holdings found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <AddHoldingModal
                    onClose={() => setShowModal(false)}
                    onError={(message) => setToast({ type: 'error', message })}
                    onAdded={() => {
                        setShowModal(false);
                        setToast({ type: 'success', message: 'Stock added successfully' });
                        fetchHoldings();
                    }}
                />
            )}
        </div>
    );
};

export default Holdings;
