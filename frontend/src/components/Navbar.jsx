import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navClass = (path) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === path
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur px-4 sm:px-6 py-3">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <div className="font-bold text-xl text-blue-600 tracking-tight">StockSense</div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <Link to="/dashboard" className={navClass('/dashboard')}>Dashboard</Link>
                    <Link to="/holdings" className={navClass('/holdings')}>Holdings</Link>
                    <Link to="/transactions" className={navClass('/transactions')}>Transactions</Link>
                    <Link to="/watchlist" className={navClass('/watchlist')}>Watchlist</Link>
                    <div className="ml-2 hidden sm:flex items-center gap-3 border-l border-gray-200 pl-4">
                        <span className="text-sm text-gray-500">{user?.name}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
