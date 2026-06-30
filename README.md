# 📈 Nifty50 ML Backtester — Production Web App

A full-stack, production-ready backtesting platform for Nifty 50 ML trading strategies.  
Built with **FastAPI + React + Tailwind CSS**, containerised with **Docker**.

---

## 🗂 Project Structure

```
nifty50-backtester/
│
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── routes/
│   │   ├── backtest.py            # POST /api/backtest/run, /compare
│   │   └── data.py                # POST /api/data/upload, GET /api/data/files
│   ├── services/
│   │   └── backtest_service.py    # Core engine (load, split, signal, backtest, metrics)
│   ├── models/
│   │   └── schemas.py             # Pydantic request/response models
│   ├── utils/
│   │   └── logger.py              # Structured logging + timer decorator
│   └── data/                      # Default datasets (bundled)
│       ├── fused_dataset.csv
│       ├── Nifty50_Master_Cleaned_Full.csv
│       ├── sentiment_daily.csv
│       ├── momentum_features.csv
│       └── clean_price_master.csv
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Root with tab routing
│   │   ├── main.jsx               # React entry point
│   │   ├── index.css              # Tailwind + custom component classes
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Top navigation
│   │   │   ├── StrategyPanel.jsx  # Strategy selector + parameter inputs
│   │   │   ├── MetricsGrid.jsx    # 8-card performance dashboard
│   │   │   ├── EquityChart.jsx    # Recharts area chart (single + compare)
│   │   │   ├── DrawdownChart.jsx  # Recharts drawdown chart
│   │   │   ├── TradeTable.jsx     # Sortable, paginated, CSV-exportable trade log
│   │   │   ├── ComparePanel.jsx   # Multi-strategy comparison controls
│   │   │   ├── ComparisonTable.jsx# Side-by-side metrics table
│   │   │   └── UploadManager.jsx  # Drag-and-drop file uploader
│   │   ├── pages/
│   │   │   ├── BacktestPage.jsx   # Single strategy backtest view
│   │   │   ├── ComparePage.jsx    # Multi-strategy comparison view
│   │   │   └── UploadPage.jsx     # Dataset management view
│   │   ├── hooks/
│   │   │   └── useBacktest.js     # API state management hook
│   │   └── services/
│   │       └── api.js             # Axios API client
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── Dockerfile.backend
├── Dockerfile.frontend
├── docker-compose.yml
├── nginx.conf
├── requirements.txt
└── README.md
```

---

## ⚡ Quick Start — Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip

---

### 1. Backend Setup

```bash
# From project root
cd nifty50-backtester

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be live at: http://localhost:8000  
Interactive docs: http://localhost:8000/docs

---

### 2. Frontend Setup

```bash
# From project root (new terminal)
cd nifty50-backtester/frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start dev server
npm run dev
```

Frontend will be live at: http://localhost:5173

---

## 🐳 Docker — Full Stack

```bash
# From project root
cd nifty50-backtester

# Build and start both services
docker-compose up --build

# Run in background
docker-compose up --build -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop
docker-compose down
```

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🔌 API Reference

### Run Backtest
```
POST /api/backtest/run
Content-Type: application/json

{
  "strategy": "momentum",          // "momentum" | "sentiment" | "hybrid_ml"
  "initial_capital": 100000,
  "hold_days": 5,
  "position_size_pct": 0.02,
  "transaction_cost": 0.001,
  "train_pct": 0.70,
  "momentum_threshold": 0.5,
  "sentiment_threshold": 0.1
}
```

Response includes: `metrics`, `equity_curve`, `drawdown`, `trades`, `run_id`

### Compare Strategies
```
POST /api/backtest/compare
Content-Type: application/json

{
  "strategies": ["momentum", "sentiment", "hybrid_ml"],
  "initial_capital": 100000,
  "hold_days": 5,
  ...
}
```

### Upload Dataset
```
POST /api/data/upload
Content-Type: multipart/form-data

file: <your_file.csv>
```

### Other Endpoints
```
GET  /api/backtest/strategies    # List available strategies
GET  /api/data/files             # List uploaded files
DELETE /api/data/files/{name}    # Delete an uploaded file
GET  /health                     # Health check
GET  /docs                       # Swagger UI
```

---

## 📊 Strategies

| Strategy | Signal Column | Type | Default Threshold |
|----------|--------------|------|-------------------|
| Momentum Only | `Momentum_score` | Continuous | > 0.5 |
| Sentiment Only | `Sentiment_score` | Continuous | > 0.1 |
| Hybrid ML | `BUY` | Binary (0/1) | — |

---

## 📈 Performance Metrics

| Metric | Description |
|--------|-------------|
| CAGR | Compound Annual Growth Rate |
| Sharpe Ratio | Risk-adjusted return (annualised) |
| Max Drawdown | Worst peak-to-trough decline |
| Win Rate | % of profitable trades |
| Total Trades | Number of completed round-trips |
| Total PnL | Gross profit and loss in ₹ |
| Final Capital | Portfolio value at end of test period |

---

## 🔧 Configuration

All parameters can be set from the UI. Backend defaults:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `initial_capital` | ₹1,00,000 | Starting portfolio value |
| `hold_days` | 5 | Trading days to hold each position |
| `position_size_pct` | 2% | Capital allocated per signal |
| `transaction_cost` | 0.1% | Cost per leg (entry + exit) |
| `train_pct` | 70% | Train/test time-series split |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, Pydantic v2, Pandas, NumPy |
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Containerisation | Docker, Docker Compose, Nginx |
| Data | CSV / XLS / XLSX (Nifty 50 OHLCV + features) |

---

## 📝 Notes

- The backtest engine uses a **time-based 70/30 train/test split** — no look-ahead bias
- Entry is at next-day **OPEN**; exit is at **CLOSE** after `hold_days`
- Transaction costs are charged on **both** entry and exit legs
- All remaining positions are force-closed at end of test period
- The `Hybrid ML` strategy uses the pre-computed `BUY` column (Logistic Regression output from the notebook)
