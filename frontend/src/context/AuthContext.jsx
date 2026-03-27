import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [portfolioId, setPortfolioId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getMe()
                .then(res => {
                    setUser(res.data.user);
                    setPortfolioId(res.data.portfolioId);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await apiLogin(email, password);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setPortfolioId(res.data.portfolioId);
    };

    const registerUser = async (name, email, password) => {
        const res = await apiRegister(name, email, password);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setPortfolioId(res.data.portfolioId);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setPortfolioId(null);
    };

    return (
        <AuthContext.Provider value={{ user, portfolioId, loading, login, registerUser, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
