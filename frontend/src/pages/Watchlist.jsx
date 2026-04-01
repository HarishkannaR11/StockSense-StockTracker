import { useEffect, useState } from 'react';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import {
    addAlert,
    addWatchlistItem,
    checkAlerts,
    deleteAlert,
    deleteWatchlistItem,
    exportPortfolioCsv,
    getAlerts,
    getWatchlist
} from '../services/api';

const Watchlist = () => {
    const { portfolioId } = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [toast, setToast] = useState(null);
    const [itemForm, setItemForm] = useState({ symbol: '', companyName: '' });
    const [alertForm, setAlertForm] = useState({ symbol: '', condition: 'ABOVE', targetPrice: '' });

    const loadData = async () => {
        try {
            const [watchRes, alertRes] = await Promise.all([
                getWatchlist(),
                portfolioId ? getAlerts(portfolioId) : Promise.resolve({ data: [] })
            ]);
            setWatchlist(watchRes.data);
            setAlerts(alertRes.data || []);
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to load watchlist/alerts' });
        }
    };

    useEffect(() => {
        loadData();
    }, [portfolioId]);

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await addWatchlistItem(itemForm);
            setItemForm({ symbol: '', companyName: '' });
            setToast({ type: 'success', message: 'Added to watchlist' });
            loadData();
        } catch (err) {
            setToast({ type: 'error', message: err.response?.data?.message || 'Failed to add watchlist item' });
        }
    };

    const handleAddAlert = async (e) => {
        e.preventDefault();
        if (!portfolioId) return;
        try {
            await addAlert(portfolioId, { ...alertForm, targetPrice: Number(alertForm.targetPrice) });
            setAlertForm({ symbol: '', condition: 'ABOVE', targetPrice: '' });
            setToast({ type: 'success', message: 'Price alert created' });
            loadData();
        } catch (err) {
            setToast({ type: 'error', message: err.response?.data?.message || 'Failed to create alert' });
        }
    };

    const handleCheckAlerts = async () => {
        if (!portfolioId) return;
        try {
            const res = await checkAlerts(portfolioId);
            const count = res.data.triggeredCount || 0;
            setToast({ type: 'success', message: count ? `${count} alert(s) triggered` : 'No alerts triggered' });
            loadData();
        } catch (err) {
            setToast({ type: 'error', message: err.response?.data?.message || 'Failed to check alerts' });
        }
    };

    const handleExportCsv = async () => {
        if (!portfolioId) return;
        try {
            const res = await exportPortfolioCsv(portfolioId);
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv;charset=utf-8;' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'stocksense-portfolio-export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setToast({ type: 'success', message: 'CSV exported successfully' });
        } catch (err) {
            setToast({ type: 'error', message: err.response?.data?.message || 'CSV export failed' });
        }
    };

    return (
        <div>
            <Toast toast={toast} onClose={() => setToast(null)} />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Watchlist & Alerts</h1>
                    <p className="mt-1 text-sm text-gray-500">Track symbols, create alerts, and export your data.</p>
                </div>
                <button
                    onClick={handleExportCsv}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Export CSV
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-3 text-lg font-semibold text-gray-900">Add Watchlist Item</h2>
                    <form onSubmit={handleAddItem} className="space-y-3">
                        <input
                            value={itemForm.symbol}
                            onChange={(e) => setItemForm({ ...itemForm, symbol: e.target.value.toUpperCase() })}
                            placeholder="Symbol (e.g. TCS)"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            required
                        />
                        <input
                            value={itemForm.companyName}
                            onChange={(e) => setItemForm({ ...itemForm, companyName: e.target.value })}
                            placeholder="Company Name (optional)"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Add</button>
                    </form>

                    <div className="mt-4 space-y-2">
                        {watchlist.map((item) => (
                            <div key={item._id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                                <div>
                                    <div className="font-semibold text-gray-900">{item.symbol}</div>
                                    <div className="text-xs text-gray-500">{item.companyName || '-'}</div>
                                </div>
                                <button
                                    onClick={async () => {
                                        await deleteWatchlistItem(item._id);
                                        loadData();
                                    }}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                        {watchlist.length === 0 && <p className="text-sm text-gray-500">No watchlist items yet.</p>}
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Price Alerts</h2>
                        <button
                            onClick={handleCheckAlerts}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Check Alerts
                        </button>
                    </div>

                    <form onSubmit={handleAddAlert} className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <input
                            value={alertForm.symbol}
                            onChange={(e) => setAlertForm({ ...alertForm, symbol: e.target.value.toUpperCase() })}
                            placeholder="Symbol"
                            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            required
                        />
                        <select
                            value={alertForm.condition}
                            onChange={(e) => setAlertForm({ ...alertForm, condition: e.target.value })}
                            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                        >
                            <option value="ABOVE">ABOVE</option>
                            <option value="BELOW">BELOW</option>
                        </select>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={alertForm.targetPrice}
                            onChange={(e) => setAlertForm({ ...alertForm, targetPrice: e.target.value })}
                            placeholder="Target Price"
                            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            required
                        />
                        <button className="md:col-span-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Create Alert</button>
                    </form>

                    <div className="mt-4 space-y-2">
                        {alerts.map((alert) => (
                            <div key={alert._id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                                <div>
                                    <div className="font-semibold text-gray-900">{alert.symbol} {alert.condition} ₹{alert.targetPrice}</div>
                                    <div className="text-xs text-gray-500">Status: {alert.isActive ? 'Active' : 'Triggered'}</div>
                                </div>
                                <button
                                    onClick={async () => {
                                        await deleteAlert(alert._id);
                                        loadData();
                                    }}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                        {alerts.length === 0 && <p className="text-sm text-gray-500">No alerts yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Watchlist;
