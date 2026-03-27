import { useEffect, useState } from 'react';
import AddHoldingModal from '../components/AddHoldingModal';
import { useAuth } from '../context/AuthContext';
import { deleteHolding, getHoldings } from '../services/api';

const Holdings = () => {
    const { portfolioId } = useAuth();
    const [holdings, setHoldings] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const fetchHoldings = async () => {
        if (!portfolioId) return;
        try {
            const res = await getHoldings(portfolioId);
            setHoldings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchHoldings();
    }, [portfolioId]);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this holding?')) {
            await deleteHolding(id);
            fetchHoldings();
        }
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Holdings</h1>
                    <p className="mt-1 text-sm text-gray-500">Track all your current positions.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                    Add Stock
                </button>
            </div>

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
                        {holdings.map(h => {
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
                            )
                        })}
                        {holdings.length === 0 && (
                            <tr><td colSpan="10" className="p-8 text-center text-sm text-gray-500">No holdings found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && <AddHoldingModal onClose={() => setShowModal(false)} onAdded={() => { setShowModal(false); fetchHoldings(); }} />}
        </div>
    );
};

export default Holdings;
