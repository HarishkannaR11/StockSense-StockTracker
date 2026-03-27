import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const PnLChart = ({ holdings }) => {
    if (!holdings || holdings.length === 0) return <div className="text-gray-500">No holdings to display</div>;

    const data = holdings.map(h => ({
        name: h.symbol,
        Invested: h.buyPrice * h.quantity,
        Current: h.currentPrice * h.quantity
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="Invested" fill="#3B82F6" />
                <Bar dataKey="Current" fill="#10B981" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default PnLChart;
