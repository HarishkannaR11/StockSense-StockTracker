import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Holdings from './pages/Holdings';
import Login from './pages/Login';
import Register from './pages/Register';
import Transactions from './pages/Transactions';
import Watchlist from './pages/Watchlist';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-white text-gray-900 font-sans">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/holdings" element={<Holdings />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/watchlist" element={<Watchlist />} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
