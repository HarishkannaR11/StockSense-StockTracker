import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL,
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
export const exportPortfolioCsv = (id) => api.get(`/portfolios/${id}/export/csv`, { responseType: 'blob' });

// Holdings
export const getHoldings = (portfolioId) => api.get(`/portfolios/${portfolioId}/holdings`);
export const addHolding = (portfolioId, data) => api.post(`/portfolios/${portfolioId}/holdings`, data);
export const getLiveQuote = (symbol) => api.get(`/market/quote/${encodeURIComponent(symbol)}`);
export const refreshPortfolioPrices = (portfolioId) => api.post(`/portfolios/${portfolioId}/holdings/refresh-prices`);
export const updatePrice = (id, currentPrice) => api.patch(`/holdings/${id}/price`, { currentPrice });
export const deleteHolding = (id) => api.delete(`/holdings/${id}`);

// Transactions
export const getTransactions = (portfolioId) => api.get(`/portfolios/${portfolioId}/transactions`);
export const addTransaction = (portfolioId, data) => api.post(`/portfolios/${portfolioId}/transactions`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

// Chatbot
export const sendChatMessage = (message, history = []) => api.post('/chat/message', { message, history });

// Watchlist
export const getWatchlist = () => api.get('/watchlist');
export const addWatchlistItem = (data) => api.post('/watchlist', data);
export const deleteWatchlistItem = (id) => api.delete(`/watchlist/${id}`);

// Alerts
export const getAlerts = (portfolioId) => api.get(`/portfolios/${portfolioId}/alerts`);
export const addAlert = (portfolioId, data) => api.post(`/portfolios/${portfolioId}/alerts`, data);
export const checkAlerts = (portfolioId) => api.post(`/portfolios/${portfolioId}/alerts/check`);
export const deleteAlert = (id) => api.delete(`/alerts/${id}`);

export default api;
