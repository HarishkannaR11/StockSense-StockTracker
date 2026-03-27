import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (name, email, password) => api.post('/auth/register', { name, email, password });
export const getMe = () => api.get('/auth/me');

// Portfolios
export const getPortfolio = (id) => api.get(`/portfolios/${id}`);

// Holdings
export const getHoldings = (portfolioId) => api.get(`/portfolios/${portfolioId}/holdings`);
export const addHolding = (portfolioId, data) => api.post(`/portfolios/${portfolioId}/holdings`, data);
export const getLiveQuote = (symbol) => api.get(`/market/quote/${encodeURIComponent(symbol)}`);
export const updatePrice = (id, currentPrice) => api.patch(`/holdings/${id}/price`, { currentPrice });
export const deleteHolding = (id) => api.delete(`/holdings/${id}`);

// Transactions
export const getTransactions = (portfolioId) => api.get(`/portfolios/${portfolioId}/transactions`);
export const addTransaction = (portfolioId, data) => api.post(`/portfolios/${portfolioId}/transactions`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

export default api;
