"""
repository.py

Repository layer for Portfolio.

Responsibilities:
1. Read portfolio from JSON
2. Write portfolio to JSON
3. CRUD Operations

NOTE:
No business logic should be added here.
"""

# ==========================================================
# Standard Library Imports
# ==========================================================

import json
import logging
from typing import List, Optional
# ==========================================================
# Local Imports
# ==========================================================
from app.config import PORTFOLIO_FILE
from app.dashboard.schemas import (
    Portfolio,
    CreatePortfolio,
    UpdatePortfolio,
)

# ==========================================================
# Logger
# ==========================================================

logger = logging.getLogger(__name__)

class PortfolioRepository:
    @staticmethod
    def _read_json() -> dict:
        """
        Read portfolio.json
        """
        try:
            with open(PORTFOLIO_FILE, "r", encoding="utf-8") as file:
                return json.load(file)
        except FileNotFoundError:
            logger.warning("portfolio.json not found. Creating new structure.")
            return {"portfolio": []}
        except json.JSONDecodeError:
            logger.error("Invalid JSON format.")
            raise
        except Exception as ex:
            logger.exception(ex)
            raise

    @staticmethod
    def _write_json(data: dict) -> None:        
        """
        Write data into portfolio.json
        """
        try:
            with open(PORTFOLIO_FILE, "w", encoding="utf-8") as file:
                json.dump(
                    data,
                    file,
                    indent=4,
                    default=str
                )
        except Exception as ex:
            logger.exception(ex)
            raise

    @classmethod
    def get_all(cls) -> List[Portfolio]:
        """
        Returns all holdings.
        """
        data = cls._read_json()
        return [
            Portfolio(**item)
            for item in data.get("portfolio", [])
        ]

    @classmethod
    def get_by_id(cls, portfolio_id: int) -> Optional[Portfolio]:
        """
        Get one holding using ID.
        """

        portfolio = cls.get_all()

        for holding in portfolio:

            if holding.id == portfolio_id:
                return holding

        return None

    @classmethod
    def generate_next_id(cls) -> int:
        """
        Generate next available ID.
        """

        portfolio = cls.get_all()
        if not portfolio:
            return 1
        return max(item.id for item in portfolio) + 1

    @classmethod
    def add(cls, stock: CreatePortfolio) -> Portfolio:
        """
        Add a new stock.
        """

        data = cls._read_json()
        new_stock = Portfolio(
            id=cls.generate_next_id(),
            **stock.model_dump()
        )
        data["portfolio"].append(
            new_stock.model_dump(mode="json")
        )
        cls._write_json(data)
        logger.info(
            "Added stock %s",
            new_stock.symbol
        )
        return new_stock

    @classmethod
    def update(
        cls,
        portfolio_id: int,
        stock: UpdatePortfolio
    ) -> Portfolio:
        """
        Update existing holding.
        """

        data = cls._read_json()
        updated = None
        for item in data["portfolio"]:
            if item["id"] == portfolio_id:
                update_values = stock.model_dump(
                    exclude_unset=True,
                    exclude_none=True
                )
                item.update(update_values)
                updated = Portfolio(**item)
                break
        if updated is None:
            raise ValueError(
                f"Portfolio ID {portfolio_id} not found."
            )
        cls._write_json(data)
        logger.info(
            "Updated Portfolio ID %d",
            portfolio_id
        )

        return updated

    @classmethod
    def delete(cls, portfolio_id: int) -> bool:
        """
        Delete stock.
        """

        data = cls._read_json()
        original_count = len(data["portfolio"])
        data["portfolio"] = [
            item
            for item in data["portfolio"]
            if item["id"] != portfolio_id
        ]

        deleted = len(data["portfolio"]) != original_count

        if deleted:
            cls._write_json(data)
            logger.info(
                "Deleted Portfolio ID %d",
                portfolio_id
            )
        return deleted