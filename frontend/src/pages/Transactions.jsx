import { useEffect, useState } from 'react';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { addTransaction, getTransactions } from '../services/api';

const Transactions = () => {
    const { portfolioId } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [toast, setToast] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        symbol: '',
        type: 'BUY',
        quantity: '',
        price: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchTransactions = async () => {
        if (!portfolioId) return;
        try {
            const res = await getTransactions(portfolioId);
            setTransactions(res.data);
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to load transactions' });
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [portfolioId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!portfolioId) return;

        try {
            setSubmitting(true);
            await addTransaction(portfolioId, {
                symbol: form.symbol.toUpperCase().trim(),
                type: form.type,
                quantity: Number(form.quantity),
                price: Number(form.price),
                notes: form.notes,
                date: form.date
            });
            setToast({ type: 'success', message: `${form.type} transaction added` });
            setForm({
                symbol: '',
                type: 'BUY',
                quantity: '',
                price: '',
                notes: '',
                date: new Date().toISOString().split('T')[0]
            });
            fetchTransactions();
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.error || 'Failed to add transaction';
            setToast({ type: 'error', message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Toast toast={toast} onClose={() => setToast(null)} />
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Transaction History</h1>
                <p className="mt-1 text-sm text-gray-500">Recent buy and sell activity across your portfolio.</p>
            </div>

            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-lg font-semibold text-gray-900">Add Transaction</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-6">
                    <input
                        type="text"
                        placeholder="Symbol"
                        value={form.symbol}
                        onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase focus:border-blue-500 focus:outline-none"
                        required
                    />
                    <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    >
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                    </select>
                    <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                        required
                    />
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                        required
                    />
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                        required
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {submitting ? 'Saving...' : 'Add'}
                    </button>
                    <input
                        type="text"
                        placeholder="Notes (optional)"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="md:col-span-6 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                </form>
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
