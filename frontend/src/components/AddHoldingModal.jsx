import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addHolding, getLiveQuote } from '../services/api';

const AddHoldingModal = ({ onClose, onAdded }) => {
    const { portfolioId } = useAuth();
    const [formData, setFormData] = useState({
        symbol: '',
        companyName: '',
        quantity: '',
        buyPrice: '',
        currentPrice: '',
        buyDate: new Date().toISOString().split('T')[0]
    });
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [quoteError, setQuoteError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'symbol' ? value.toUpperCase() : value
        });
    };

    const handleFetchQuote = async () => {
        const symbol = formData.symbol.trim();
        if (!symbol) return;

        try {
            setQuoteLoading(true);
            setQuoteError('');
            const res = await getLiveQuote(symbol);
            setFormData((prev) => ({
                ...prev,
                symbol: symbol.toUpperCase(),
                companyName: prev.companyName || res.data.companyName || '',
                currentPrice: String(res.data.currentPrice ?? prev.currentPrice)
            }));
        } catch (err) {
            setQuoteError(err.response?.data?.message || 'Unable to fetch live quote');
        } finally {
            setQuoteLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addHolding(portfolioId, {
                ...formData,
                quantity: Number(formData.quantity),
                buyPrice: Number(formData.buyPrice),
                currentPrice: Number(formData.currentPrice || formData.buyPrice),
            });
            onAdded();
        } catch (err) {
            console.error(err);
            alert('Error adding holding');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                <h2 className="mb-1 text-xl font-semibold text-gray-900">Add Holding</h2>
                <p className="mb-5 text-sm text-gray-500">Enter stock details to update your portfolio.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <input
                            name="symbol"
                            placeholder="Symbol (e.g. RELIANCE)"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase focus:border-blue-500 focus:outline-none"
                            required
                            value={formData.symbol}
                            onBlur={handleFetchQuote}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={handleFetchQuote}
                            disabled={quoteLoading || !formData.symbol.trim()}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {quoteLoading ? 'Fetching...' : 'Fetch'}
                        </button>
                    </div>
                    {quoteError && <p className="-mt-2 text-xs text-red-500">{quoteError}</p>}
                    <input
                        name="companyName"
                        placeholder="Company Name"
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                    />
                    <div className="flex gap-4">
                        <input type="number" name="quantity" placeholder="Quantity" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" required min="1" value={formData.quantity} onChange={handleChange} />
                        <input type="number" name="buyPrice" placeholder="Buy Price (₹)" step="0.01" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" required min="0" value={formData.buyPrice} onChange={handleChange} />
                    </div>
                    <div className="flex gap-4">
                        <input type="number" name="currentPrice" placeholder="Current Price (₹)" step="0.01" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" required min="0" value={formData.currentPrice} onChange={handleChange} />
                        <input type="date" name="buyDate" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" required value={formData.buyDate} onChange={handleChange} />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button type="button" onClick={onClose} className="text-sm text-gray-500 underline hover:text-gray-700">Cancel</button>
                        <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHoldingModal;
