"""
market_service.py

Responsible for fetching live market data from Yahoo Finance.

This module SHOULD NOT contain any business logic.

Responsibilities:
1. Current Price
2. Previous Close
3. Market Cap
4. Sector
5. Company Name
6. Book Value
"""

# ==========================================================
# Standard Library Imports
# ==========================================================

import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List
# ==========================================================
# Third Party Imports
# =========================================================
import yfinance as yf
# ==========================================================
# Local Imports
# =========================================================
from app.dashboard.schemas import LiveStockData
# ==========================================================
# Logger
# ==========================================================

logger = logging.getLogger(__name__)


class MarketService:
    """
    Fetches market information from Yahoo Finance.
    """

    @staticmethod
    def get_stock_data(symbol: str) -> LiveStockData:
        """
        Fetch market data for a single stock.
        """
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            history = ticker.history(period="2d")
            current_price = 0.0
            previous_close = 0.0
            if not history.empty:
                current_price = float(history["Close"].iloc[-1])
                if len(history) > 1:
                    previous_close = float(history["Close"].iloc[-2])
            return LiveStockData(
                company_name=info.get("longName"),
                current_price=current_price,
                previous_close=previous_close,
                market_cap=info.get("marketCap"),
                sector=info.get("sector"),
                book_value=info.get("bookValue")
            )
        except Exception as ex:
            logger.exception(
                "Failed to fetch data for %s : %s",
                symbol,
                ex
            )
            return LiveStockData()


    @classmethod
    def get_multiple_stock_data(
        cls,
        symbols: List[str]
    ) -> Dict[str, LiveStockData]:
        """
        Fetch multiple stocks concurrently.
        Returns a dictionary mapping symbols to LiveStockData.
        {
            "RELIANCE.NS": LiveStockData(),
            "TCS.NS": LiveStockData()
        }
        """
        results = {}
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = {
                executor.submit(
                    cls.get_stock_data,
                    symbol
                ): symbol
                for symbol in symbols
            }
            for future in as_completed(futures):
                symbol = futures[future]
                try:
                    results[symbol] = future.result()
                except Exception as ex:
                    logger.exception(ex)
                    results[symbol] = LiveStockData()
        return results