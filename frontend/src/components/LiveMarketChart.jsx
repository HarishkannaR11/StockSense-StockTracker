import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const LiveMarketChart = ({ holdings }) => {
    if (!holdings || holdings.length === 0) {
        return <div className="text-sm text-gray-500">No live market data available.</div>;
    }

    const data = holdings.map((item) => ({
        symbol: item.symbol,
        price: Number(item.currentPrice || 0)
    }));

    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 12, right: 20, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symbol" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Live Price']} />
                <Bar dataKey="price" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default LiveMarketChart;
