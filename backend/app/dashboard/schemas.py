"""
schemas.py

Pydantic models for the Dashboard module.

These models define the contract between:
1. JSON Storage
2. Backend Business Logic
3. FastAPI APIs
4. React Frontend
"""

# ==========================================================
# Standard Library Imports
# ==========================================================
from datetime import date
from typing import List, Optional
# ==========================================================
# Third Party Imports
# ==========================================================
from pydantic import BaseModel, Field

# ==========================================================
# Portfolio Models
# ==========================================================

class Portfolio(BaseModel):
    """
    Represents one stock holding stored in portfolio.json.
    """

    id: int = Field(..., description="Unique portfolio id")
    symbol: str = Field(..., description="Stock Symbol (Example: RELIANCE.NS)")
    buy_date: date
    buy_price: float = Field(..., gt=0,        description="Price at which one share was purchased"
    )
    quantity: int = Field(
        ...,
        gt=0,
        description="Number of shares purchased"
    )
    notes: Optional[str] = ""


class CreatePortfolio(BaseModel):
    """
    Model used while creating a new portfolio entry.
    """

    symbol: str
    buy_date: date
    buy_price: float
    quantity: int
    notes: Optional[str] = ""


class UpdatePortfolio(BaseModel):
    """
    Model used while updating an existing holding.
    """
    symbol: Optional[str] = None
    buy_date: Optional[date] = None
    buy_price: Optional[float] = None
    quantity: Optional[int] = None
    notes: Optional[str] = None


# ==========================================================
# Live Stock Data
# ==========================================================

class LiveStockData(BaseModel):
    """
    Dynamic values fetched from yfinance.
    """

    company_name: Optional[str] = None
    current_price: float = 0
    previous_close: float = 0
    market_cap: Optional[float] = None
    sector: Optional[str] = None
    book_value: Optional[float] = None

# ==========================================================
# Stock Details
# ==========================================================

class StockMarketDetails(BaseModel):
    """
    Current market information for a stock.
    """

    current_price: Optional[float] = None
    previous_close: Optional[float] = None
    today_change: Optional[float] = None
    today_change_percent: Optional[float] = None

    week_52_high: Optional[float] = None
    week_52_low: Optional[float] = None

    volume: Optional[int] = None
    market_cap: Optional[float] = None


class StockFundamentalDetails(BaseModel):
    """
    Fundamental information for a stock.
    """

    revenue: Optional[float] = None
    profit: Optional[float] = None
    eps: Optional[float] = None

    pe_ratio: Optional[float] = None
    pb_ratio: Optional[float] = None

    book_value: Optional[float] = None

    debt: Optional[float] = None
    debt_equity: Optional[float] = None

    roe: Optional[float] = None
    roce: Optional[float] = None

    dividend_yield: Optional[float] = None


class StockDetails(BaseModel):
    """
    Complete details for one stock.
    """

    symbol: str
    company_name: Optional[str] = None
    sector: Optional[str] = None

    market: StockMarketDetails
    fundamentals: StockFundamentalDetails

class StockDetailsResponse(BaseModel):
    """
    API response for the Stock Details drawer.
    """

    stock: StockDetails


# ==========================================================
# Dashboard Row
# ==========================================================

class DashboardStock(BaseModel):
    """
    Represents one row in the Dashboard Table.
    """

    # Static Portfolio Data

    id: int
    symbol: str
    buy_date: date
    buy_price: float
    quantity: int
    # Calculated
    invested_amount: float
    current_value: float
    profit_loss: float
    one_day_profit: float
    return_percent: float
    days_invested: int
    # Live Data
    current_price: float
    previous_close: float
    market_cap: Optional[float]
    sector: Optional[str]
    company_name: Optional[str]
    book_value: Optional[float]


# ==========================================================
# Summary Cards
# ==========================================================

class DashboardSummary(BaseModel):
    """
    Dashboard Summary Cards.
    """

    total_investment: float
    current_value: float
    total_profit_loss: float
    today_profit_loss: float
    overall_return_percent: float
    total_holdings: int


# ==========================================================
# Sector Allocation
# ==========================================================

class SectorAllocation(BaseModel):

    sector: str
    invested_amount: float
    holdings: int
    companies: list[str]


# ==========================================================
# Complete Dashboard Response
# ==========================================================

class DashboardResponse(BaseModel):

    summary: DashboardSummary
    portfolio: List[DashboardStock]
    sector_distribution: List[SectorAllocation]