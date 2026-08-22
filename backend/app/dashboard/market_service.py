"""
market_service.py

Responsible for fetching live market data from Yahoo Finance.

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
import math

from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List


# ==========================================================
# Third Party Imports
# ==========================================================

import yfinance as yf


# ==========================================================
# Local Imports
# ==========================================================

from app.dashboard.schemas import LiveStockData


# ==========================================================
# Logger
# ==========================================================

logger = logging.getLogger(__name__)


# ==========================================================
# Safe Float Helper
# ==========================================================

def safe_float(value, default=None):
    """
    Convert a value to a JSON-safe float.

    Returns default for:
    - None
    - NaN
    - Infinity
    - invalid values
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


# ==========================================================
# Market Service
# ==========================================================

class MarketService:
    """
    Fetches market information from Yahoo Finance.
    """

    # ======================================================
    # Single Stock
    # ======================================================

    @staticmethod
    def get_stock_data(symbol: str) -> LiveStockData:

        """
        Fetch market data for a single stock.

        Current price is taken from Yahoo Finance
        fast_info, which is the same source used by
        our standalone test script.
        """

        try:

            logger.info(
                "Fetching market data for %s",
                symbol
            )

            # --------------------------------------------------
            # Yahoo ticker
            # --------------------------------------------------

            ticker = yf.Ticker(symbol)

            # --------------------------------------------------
            # Fast market information
            # --------------------------------------------------

            fast_info = ticker.fast_info

            # --------------------------------------------------
            # Full company information
            # --------------------------------------------------

            info = ticker.info

            # ==================================================
            # Current Price
            # ==================================================

            current_price = safe_float(
                fast_info.get("lastPrice"),
                None
            )

            # ==================================================
            # Previous Close
            # ==================================================

            previous_close = safe_float(
                fast_info.get("previousClose"),
                None
            )

            # ==================================================
            # Fallback for Previous Close
            # ==================================================

            if previous_close is None:

                previous_close = safe_float(
                    info.get("previousClose"),
                    0
                )

            # ==================================================
            # Fallback for Current Price
            # ==================================================

            # In case fast_info doesn't provide lastPrice,
            # try regular price information.

            if current_price is None:

                current_price = safe_float(
                    info.get("currentPrice"),
                    None
                )

            # ==================================================
            # Final fallback: History
            # ==================================================

            if current_price is None:

                try:

                    history = ticker.history(
                        period="2d"
                    )

                    if not history.empty:

                        current_price = safe_float(
                            history["Close"].iloc[-1],
                            0
                        )

                        if (
                            previous_close is None
                            and len(history) > 1
                        ):

                            previous_close = safe_float(
                                history["Close"].iloc[-2],
                                0
                            )

                except Exception as history_error:

                    logger.warning(
                        "History fallback failed for %s: %s",
                        symbol,
                        history_error
                    )

            # --------------------------------------------------
            # Safe final defaults
            # --------------------------------------------------

            if current_price is None:
                current_price = 0

            if previous_close is None:
                previous_close = 0

            # ==================================================
            # Company Name
            # ==================================================

            company_name = (
                info.get("shortName")
                or info.get("longName")
                or symbol
            )

            # ==================================================
            # Sector
            # ==================================================

            sector = (
                info.get("sector")
                or "Unknown"
            )

            # ==================================================
            # Market Cap
            # ==================================================

            market_cap = safe_float(
                fast_info.get("marketCap"),
                None
            )

            # Fallback to info if fast_info doesn't provide it

            if market_cap is None:

                market_cap = safe_float(
                    info.get("marketCap"),
                    None
                )

            # ==================================================
            # Book Value
            # ==================================================

            book_value = safe_float(
                info.get("bookValue"),
                None
            )

            # ==================================================
            # Log Result
            # ==================================================

            logger.info(
                "%s | Price=%s | Previous=%s | Sector=%s",
                symbol,
                current_price,
                previous_close,
                sector
            )

            # ==================================================
            # Return
            # ==================================================

            return LiveStockData(

                company_name=company_name,

                current_price=current_price,

                previous_close=previous_close,

                market_cap=market_cap,

                sector=sector,

                book_value=book_value
            )

        except Exception as ex:

            logger.exception(
                "Failed to fetch data for %s : %s",
                symbol,
                ex
            )

            return LiveStockData(
                company_name=symbol,
                current_price=0,
                previous_close=0,
                market_cap=None,
                sector="Unknown",
                book_value=None
            )

    # ======================================================
    # Multiple Stocks
    # ======================================================

    @classmethod
    def get_multiple_stock_data(
        cls,
        symbols: List[str]
    ) -> Dict[str, LiveStockData]:

        """
        Fetch multiple stocks concurrently.

        Returns:

        {
            "RELIANCE.NS": LiveStockData(...),
            "TCS.NS": LiveStockData(...)
        }
        """

        results = {}

        with ThreadPoolExecutor(
            max_workers=5
        ) as executor:

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

                    results[symbol] = (
                        future.result()
                    )

                except Exception as ex:

                    logger.exception(
                        "Failed processing %s: %s",
                        symbol,
                        ex
                    )

                    results[symbol] = LiveStockData(

                        company_name=symbol,

                        current_price=0,

                        previous_close=0,

                        market_cap=None,

                        sector="Unknown",

                        book_value=None
                    )

        return results