"""
schemas.py

Pydantic models for the News module.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class NewsArticle(BaseModel):
    """
    Normalized news article.

    Categories:
        stock
        sector
        market
    """

    article_id: str
    category: str
    # Stock news only
    symbol: Optional[str] = None
    # Sector news only
    sector: Optional[str] = None
    # Actual query sent to GNews
    query: str
    title: str
    source: Optional[str] = None
    published_at: Optional[datetime] = None
    google_news_url: Optional[str] = None
    fetched_at: datetime


class NewsResponse(BaseModel):
    """
    API response containing news articles.
    """

    articles: list[NewsArticle]
    total: int