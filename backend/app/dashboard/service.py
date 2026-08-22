"""
service.py

Business logic for Dashboard.

Responsibilities:
1. Merge Portfolio + Live Market Data
2. Calculate Returns
3. Build Dashboard Response
"""

# ==========================================================
# Standard Library Imports
# ==========================================================

from collections import defaultdict
from datetime import date
from typing import List
import math

# ==========================================================
# Local Imports
# ==========================================================

from app.dashboard.market_service import MarketService
from app.dashboard.repository import PortfolioRepository
from app.dashboard.schemas import (
    DashboardResponse,
    DashboardStock,
    DashboardSummary,
    LiveStockData,
    Portfolio,
    SectorAllocation,
)


class DashboardService:
    """
    Service layer responsible for dashboard calculations.
    """

    @staticmethod
    def _safe_float(value, default=None):
        """
        Convert a value to a JSON-safe float.

        Returns default when the value is:
        - None
        - NaN
        - +Infinity
        - -Infinity
        """

        if value is None:
            return default

        try:
            value = float(value)
        except (TypeError, ValueError):
            return default

        if not math.isfinite(value):
            return default

        return value

    @staticmethod
    def _create_dashboard_stock(
        portfolio: Portfolio,
        market: LiveStockData
    ) -> DashboardStock:
        """
        Create one dashboard row by combining
        portfolio + live market data.

        All numeric market values are normalized so
        NaN / Infinity values cannot reach the JSON response.
        """

        # ----------------------------------------------------------
        # Safe live market values
        # ----------------------------------------------------------

        current_price = DashboardService._safe_float(
            market.current_price,
            0
        )

        previous_close = DashboardService._safe_float(
            market.previous_close,
            0
        )

        market_cap = DashboardService._safe_float(
            market.market_cap
        )

        book_value = DashboardService._safe_float(
            market.book_value
        )

        # ----------------------------------------------------------
        # Calculations
        # ----------------------------------------------------------

        invested_amount = (
            portfolio.buy_price *
            portfolio.quantity
        )

        current_value = (
            current_price *
            portfolio.quantity
        )

        profit_loss = (
            current_value -
            invested_amount
        )

        one_day_profit = (
            (
                current_price -
                previous_close
            )
            *
            portfolio.quantity
        )

        if invested_amount > 0:

            return_percent = (
                profit_loss /
                invested_amount
            ) * 100

        else:

            return_percent = 0

        days_invested = (
            date.today() -
            portfolio.buy_date
        ).days

        # ----------------------------------------------------------
        # Final Dashboard Row
        # ----------------------------------------------------------

        return DashboardStock(

            id=portfolio.id,

            symbol=portfolio.symbol,

            buy_date=portfolio.buy_date,

            buy_price=portfolio.buy_price,

            quantity=portfolio.quantity,

            invested_amount=round(
                invested_amount,
                2
            ),

            current_value=round(
                current_value,
                2
            ),

            profit_loss=round(
                profit_loss,
                2
            ),

            one_day_profit=round(
                one_day_profit,
                2
            ),

            return_percent=round(
                return_percent,
                2
            ),

            days_invested=days_invested,

            current_price=round(
                current_price,
                2
            ),

            previous_close=round(
                previous_close,
                2
            ),

            market_cap=market_cap,

            sector=(
                market.sector
                if market.sector
                else "Unknown"
            ),

            company_name=(
                market.company_name
                if market.company_name
                else portfolio.symbol
            ),

            book_value=book_value
        )
    @staticmethod
    def _calculate_summary(
        dashboard_rows: List[DashboardStock]
    ) -> DashboardSummary:
        """
        Calculate dashboard summary cards.
        """

        total_investment = sum(
            row.invested_amount
            for row in dashboard_rows
        )
        current_value = sum(
            row.current_value
            for row in dashboard_rows
        )
        total_profit = sum(
            row.profit_loss
            for row in dashboard_rows
        )
        today_profit = sum(
            row.one_day_profit
            for row in dashboard_rows
        )
        if total_investment > 0:
            overall_return = (
                total_profit /
                total_investment
            ) * 100
        else:
            overall_return = 0
        return DashboardSummary(
            total_investment=round(
                total_investment,
                2
            ),
            current_value=round(
                current_value,
                2
            ),
            total_profit_loss=round(
                total_profit,
                2
            ),
            today_profit_loss=round(
                today_profit,
                2
            ),
            overall_return_percent=round(
                overall_return,
                2
            ),
            total_holdings=len(
                dashboard_rows
            )
        )

    @staticmethod
    def _calculate_sector_distribution(
        dashboard_rows: List[DashboardStock]
    ) -> List[SectorAllocation]:
        """
        Create sector allocation data.

        Groups portfolio holdings by sector and calculates:

        - Total invested amount
        - Number of holdings
        - Company names in each sector
        """

        sectors = defaultdict(
            lambda: {
                "invested_amount": 0.0,
                "companies": []
            }
        )

        for row in dashboard_rows:

            # ------------------------------------------------------
            # Safe Sector
            # ------------------------------------------------------

            sector = (
                row.sector.strip()
                if isinstance(row.sector, str)
                and row.sector.strip()
                else "Unknown"
            )

            # ------------------------------------------------------
            # Invested Amount
            # ------------------------------------------------------

            sectors[sector]["invested_amount"] += (
                row.invested_amount
            )

            # ------------------------------------------------------
            # Safe Company Name
            # ------------------------------------------------------

            company_name = (
                row.company_name.strip()
                if isinstance(row.company_name, str)
                and row.company_name.strip()
                else row.symbol
            )

            if company_name:
                sectors[sector]["companies"].append(
                    company_name
                )

        # ----------------------------------------------------------
        # Build SectorAllocation objects
        # ----------------------------------------------------------

        result = []

        for sector, data in sectors.items():

            # Remove duplicate company names
            companies = list(
                dict.fromkeys(
                    company
                    for company in data["companies"]
                    if company
                )
            )

            result.append(
                SectorAllocation(
                    sector=sector,

                    invested_amount=round(
                        data["invested_amount"],
                        2
                    ),

                    holdings=len(companies),

                    companies=companies
                )
            )

        return result


    @classmethod
    def get_dashboard(cls) -> DashboardResponse:

        """
        Build complete dashboard response.
        Flow
        ----
        Portfolio JSON
                ↓
        Fetch Live Market Data
                ↓
        Merge + Calculate
                ↓
        Summary
                ↓
        Sector Distribution
                ↓
        DashboardResponse
        """
        # ------------------------------------------
        # Read Portfolio
        # ------------------------------------------
        portfolio = PortfolioRepository.get_all()
        if not portfolio:
            return DashboardResponse(
                summary=DashboardSummary(
                    total_investment=0,
                    current_value=0,
                    total_profit_loss=0,
                    today_profit_loss=0,
                    overall_return_percent=0,
                    total_holdings=0
                ),
                portfolio=[],
                sector_distribution=[]
            )
        # ------------------------------------------
        # Fetch Live Market Data
        # ------------------------------------------
        symbols = [
            stock.symbol
            for stock in portfolio
        ]
        market_data = (
            MarketService.get_multiple_stock_data(
                symbols
            )
        )
        # ------------------------------------------
        # Build Dashboard Table
        # ------------------------------------------
        dashboard_rows = []
        for stock in portfolio:
            row = cls._create_dashboard_stock(
                portfolio=stock,
                market=market_data.get(
                    stock.symbol,
                    LiveStockData()
                )
            )
            dashboard_rows.append(row)
        # ------------------------------------------
        # Build Summary
        # ------------------------------------------
        summary = cls._calculate_summary(
            dashboard_rows
        )
        # ------------------------------------------
        # Sector Allocation
        # ------------------------------------------
        sector_distribution = (
            cls._calculate_sector_distribution(
                dashboard_rows
            )
        )
        # ------------------------------------------
        # Final Response
        # ------------------------------------------
        return DashboardResponse(
            summary=summary,
            portfolio=dashboard_rows,
            sector_distribution=sector_distribution
        )

    # ======================================================
    # Portfolio CRUD
    # ======================================================

    @staticmethod
    def get_portfolio():
        """
        Return all portfolio holdings.
        """
        dashboard = DashboardService.get_dashboard()
        return dashboard.portfolio

    @staticmethod
    def add_stock(stock):
        """
        Add a new stock to portfolio.
        """
        return PortfolioRepository.add(stock)

    @staticmethod
    def update_stock(portfolio_id, stock):
        """
        Update an existing stock.
        """
        return PortfolioRepository.update(
            portfolio_id,
            stock
        )

    @staticmethod
    def delete_stock(portfolio_id):

        """
        Delete a stock.
        """
        return PortfolioRepository.delete(
            portfolio_id
        )

    # =============================================================================
# Dashboard Summary
# =============================================================================

    @staticmethod
    def get_summary():
        """
        Returns only dashboard summary.
        """
        dashboard = DashboardService.get_dashboard()

        return dashboard.summary