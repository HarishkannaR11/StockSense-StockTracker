import { useEffect, useState } from 'react';
import LiveMarketChart from '../components/LiveMarketChart';
import PnLChart from '../components/PnLChart';
import { useAuth } from '../context/AuthContext';
import { getPortfolio } from '../services/api';

const Dashboard = () => {
    const { portfolioId } = useAuth();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (portfolioId) {
            getPortfolio(portfolioId).then(res => setData(res.data)).catch(err => console.error(err));
        }
    }, [portfolioId]);

    if (!data) return <div className="py-16 text-center text-sm text-gray-500">Loading dashboard...</div>;

    const { summary, holdings } = data;
    const isProfit = summary.totalPnL >= 0;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Your portfolio snapshot in one place.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Total Invested</div>
                    <div className="mt-2 text-2xl font-bold text-gray-900">₹{summary.totalInvested.toFixed(2)}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Current Value</div>
                    <div className="mt-2 text-2xl font-bold text-gray-900">₹{summary.currentValue.toFixed(2)}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Total P&amp;L</div>
                    <div className={`mt-2 text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-500'}`}>
                        {isProfit ? '+' : ''}₹{summary.totalPnL.toFixed(2)}
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">P&amp;L %</div>
                    <div className={`mt-2 text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-500'}`}>
                        {isProfit ? '+' : ''}{summary.pnlPercent.toFixed(2)}%
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Portfolio Chart</h2>
                    <p className="mb-4 text-sm text-gray-500">Invested value vs current value by stock.</p>
                    <PnLChart holdings={holdings} />
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Live Market Prices</h2>
                    <p className="mb-4 text-sm text-gray-500">Latest fetched market price by symbol.</p>
                    <LiveMarketChart holdings={holdings} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
