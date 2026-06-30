from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class BacktestRun(Base):
    __tablename__ = "backtest_runs"

    id = Column(Integer, primary_key=True, index=True)
    strategy = Column(String, nullable=False)
    initial_capital = Column(Float)
    hold_days = Column(Integer)
    position_size_pct = Column(Float)
    transaction_cost = Column(Float)
    train_pct = Column(Float)
    momentum_threshold = Column(Float)
    sentiment_threshold = Column(Float)
    cagr = Column(Float)
    sharpe_ratio = Column(Float)
    max_drawdown = Column(Float)
    win_rate = Column(Float)
    total_trades = Column(Integer)
    total_pnl = Column(Float)
    final_capital = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
