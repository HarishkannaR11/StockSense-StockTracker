import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const { registerUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await registerUser(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-gray-900">Create account</h2>
                <p className="mb-6 text-center text-sm text-gray-500">Start tracking your portfolio in StockSense</p>
                {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            value={name} onChange={e => setName(e.target.value)} required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            value={email} onChange={e => setEmail(e.target.value)} required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            value={password} onChange={e => setPassword(e.target.value)} required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                        />
                    </div>
                    <button type="submit" className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                        Register
                    </button>
                </form>
                <div className="mt-5 text-center text-sm">
                    <Link to="/login" className="text-blue-600 hover:underline">Already have an account? Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
