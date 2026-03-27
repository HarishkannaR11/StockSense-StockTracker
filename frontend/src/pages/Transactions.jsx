import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactions } from '../services/api';

const Transactions = () => {
    const { portfolioId } = useAuth();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (portfolioId) {
            getTransactions(portfolioId).then(res => setTransactions(res.data)).catch(err => console.error(err));
        }
    }, [portfolioId]);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Transaction History</h1>
                <p className="mt-1 text-sm text-gray-500">Recent buy and sell activity across your portfolio.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Symbol</th>
                            <th className="p-4 font-semibold">Type</th>
                            <th className="p-4 font-semibold">Qty</th>
                            <th className="p-4 font-semibold">Price</th>
                            <th className="p-4 font-semibold">Amount</th>
                            <th className="p-4 font-semibold">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4 text-gray-700">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="p-4 font-semibold text-gray-900">{t.symbol}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-sm font-semibold ${t.type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                        {t.type}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-700">{t.quantity}</td>
                                <td className="p-4 text-gray-700">₹{t.price.toFixed(2)}</td>
                                <td className="p-4 text-gray-700">₹{(t.quantity * t.price).toFixed(2)}</td>
                                <td className="p-4 text-gray-500">{t.notes || '-'}</td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr><td colSpan="7" className="p-8 text-center text-sm text-gray-500">No transactions found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
