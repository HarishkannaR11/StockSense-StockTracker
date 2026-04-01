import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatBot from './ChatBot';
import Navbar from './Navbar';

const ProtectedRoute = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
                <Outlet />
            </main>
            <ChatBot />
        </div>
    );
};

export default ProtectedRoute;
