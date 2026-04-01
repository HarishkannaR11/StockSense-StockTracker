# StockSense - Stock Portfolio Tracker

StockSense is a full-stack MVC web application for managing a stock portfolio with authentication, live market pricing, transaction history, analytics charts, watchlist, price alerts, CSV export, and an AI chat assistant.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Recharts, Tailwind utility classes
- Backend: Node.js, Express (MVC pattern), JWT auth middleware
- Database: MongoDB Atlas (Mongoose ODM)
- Auth: `jsonwebtoken`, `bcryptjs`
- AI Chat: OpenAI-compatible API gateway (configured via env)

## What Is Implemented

### Core Features

- User registration and login with JWT-based protected routes
- Auto-created default portfolio on user registration
- Holdings management (add, update, delete)
- Auto BUY transaction logging when holdings are added
- Transaction management with BUY/SELL logic
	- SELL validates available quantity
	- Holdings are adjusted after BUY/SELL
- Portfolio summary metrics:
	- Total Invested
	- Current Value
	- Total P&L
	- P&L %

### Live Market Features

- Live quote fetch by symbol
- Auto-fill company/current price while adding stocks
- Refresh live prices for all holdings in a portfolio
- Optional auto-refresh on holdings page

### Visual Analytics

- Recharts P&L chart (Invested vs Current)
- Recharts live market chart (current prices by symbol)

### Productivity & Utility Features

- Watchlist module (add/list/delete)
- Price alerts module (ABOVE/BELOW target)
- Check-trigger flow for alerts
- Portfolio CSV export (holdings + transactions)
- Floating AI chatbot integrated in protected pages
- Toast-based success/error UX

## Project Structure

```
stocksense/
	backend/
		controllers/
		middleware/
		models/
		routes/
		server.js
		.env
	frontend/
		src/
			components/
			context/
			pages/
			services/
		index.html
		package.json
	README.md
```

## Environment Variables

Create/update `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

OPENAI_API_KEY=your_chat_api_key
OPENAI_MODEL=llama-3.1-8b-instant
OPENAI_BASE_URL=https://api.groq.com/openai/v1
```

> Important: Never commit real secrets to GitHub. Rotate keys if exposed.

## Installation

From project root:

### 1) Backend

```bash
cd backend
npm install
```

### 2) Frontend

```bash
cd ../frontend
npm install
```

## Run the Project (Local)

Open 2 terminals:

### Terminal A - Backend

```bash
cd backend
npm start
```

Backend runs on: `http://localhost:5000`

### Terminal B - Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:5173` (or `5174` if port changes)

## Main API Groups

- Auth: `/api/auth/*`
- Portfolio: `/api/portfolios/*`
- Holdings: `/api/portfolios/:id/holdings`, `/api/holdings/*`
- Transactions: `/api/portfolios/:id/transactions`, `/api/transactions/*`
- Market: `/api/market/quote/:symbol`
- Watchlist: `/api/watchlist`
- Alerts: `/api/portfolios/:id/alerts`, `/api/alerts/:id`
- CSV Export: `/api/portfolios/:id/export/csv`
- Chat: `/api/chat/message`

## Build (Frontend)

```bash
cd frontend
npm run build
```

## Deployment (Recommended)

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

Make sure production frontend URL is included in backend CORS configuration.

## License

For academic mini-project use.