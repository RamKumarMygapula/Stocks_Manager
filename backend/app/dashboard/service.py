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
    def _create_dashboard_stock(
        portfolio: Portfolio,
        market: LiveStockData
    ) -> DashboardStock:
        """
        Create one dashboard row by combining
        portfolio + live market data.
        """

        invested_amount = (
            portfolio.buy_price *
            portfolio.quantity
        )
        current_value = (
            market.current_price *
            portfolio.quantity
        )
        profit_loss = (
            current_value -
            invested_amount
        )
        one_day_profit = (
            (
                market.current_price -
                market.previous_close
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
            current_price=round(market.current_price,2),
            previous_close=round(market.previous_close,2),
            market_cap=market.market_cap,
            sector=market.sector,
            company_name=market.company_name,
            book_value=(round(market.book_value, 2) if market.book_value is not None else None)
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
        Create rich sector distribution.
        """

        sectors = defaultdict(
            lambda: {
                "investment": 0,
                "companies": []
            }
        )
        for row in dashboard_rows:
            sector = row.sector or "Unknown"
            sectors[sector]["investment"] += row.invested_amount
            sectors[sector]["companies"].append(
                row.company_name
            )
        result = []
        for sector, info in sectors.items():
            result.append(
                SectorAllocation(
                    sector=sector,
                    invested_amount=round(
                        info["investment"],
                        2
                    ),
                    holdings=len(
                        info["companies"]
                    ),
                    companies=info["companies"]
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