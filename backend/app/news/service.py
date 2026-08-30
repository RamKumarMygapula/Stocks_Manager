"""
service.py

Business logic for the News module.

Responsibilities:
    - Fetch stock news
    - Fetch sector news
    - Fetch market/NIFTY news
    - Normalize GNews responses
    - Filter irrelevant articles
    - Remove duplicates
    - Store news
    - Return stored news
"""

import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from gnews import GNews
from app.news.schemas import NewsArticle
from app.dashboard.service import DashboardService
from app.news.sentiment import analyze_sentiment


# ==========================================================
# Configuration
# ==========================================================

NEWS_FILE = Path("app/data/news.json")
LOOKBACK = "7d"
MAX_RESULTS_PER_QUERY = 5
GNEWS_LANGUAGE = "en"
GNEWS_COUNTRY = "IN"

# ==========================================================
# Helpers
# ==========================================================

def _utc_now() -> datetime:
    """
    Return the current UTC timestamp.
    """
    return datetime.now(timezone.utc)


def _normalize_text(text: str) -> str:
    """
    Normalize text for comparison.
    Used mainly for:
        - relevance checks
        - duplicate detection
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ",text,)
    text = re.sub(r"\s+"," ",text,)
    return text.strip()


def _create_article_id(
    title: str,
    source: Optional[str],
    published_at: Optional[datetime],
) -> str:
    """
    Create a stable article ID.
    The same article should produce the same ID
    when encountered again.
    """
    raw = "|".join(
        [
            title or "",
            source or "",
            published_at.isoformat()
            if published_at
            else "",
        ]
    )
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:20]


def _parse_published_date(value):
    """
    Convert GNews publication date into a datetime.

    GNews commonly returns dates such as:
    'Wed, 20 Aug 2026 19:46:37 GMT'
    """
    if not value:
        return None

    try:
        from email.utils import parsedate_to_datetime

        return parsedate_to_datetime(value)
    except (TypeError, ValueError, OverflowError):
        return None


def _extract_source(article: dict) -> Optional[str]:
    """
    Extract publisher/source name from GNews response.
    """
    publisher = article.get("publisher")
    if isinstance(publisher, dict):
        return publisher.get("title")
    if isinstance(publisher, str):
        return publisher
    return None

def _is_relevant(title: str,query: str,category: str,) -> bool:
    """
    Basic relevance filter.
    For stock news:
        Require meaningful overlap between the company
        query and the article title.
    Sector and market news are less restrictive because
    their queries are intentionally broad.
    """
    if not title:
        return False
    if category in {"sector", "market"}:
        return True
    title_normalized = _normalize_text(title)
    query_normalized = _normalize_text(query)
    query_words = [
        word
        for word in query_normalized.split()
        if len(word) >= 3
    ]
    if not query_words:
        return True
    matches = sum(
        word in title_normalized
        for word in query_words
    )
    # At least one meaningful company-name word
    # should appear in the title.
    return matches >= 1

def _normalize_article(article: dict,category: str,symbol: Optional[str] = None,sector: Optional[str] = None,query: str = "",) -> Optional[NewsArticle]:
    """
    Convert a raw GNews article into our NewsArticle schema.
    """
    title = article.get("title")
    if not title:
        return None
    source = _extract_source(article)
    published_at = _parse_published_date(article.get("published date"))
    if not _is_relevant(title=title,query=query,category=category,):
        return None
    article_id = _create_article_id(title=title,source=source,published_at=published_at,)
    sentiment, sentiment_score = analyze_sentiment(title)
    return NewsArticle(
        article_id=article_id,
        category=category,
        symbol=symbol,
        sector=sector,
        query=query,
        title=title,
        sentiment=sentiment,
        sentiment_score=sentiment_score,
        source=source,
        published_at=published_at,
        google_news_url=article.get("url"),
        fetched_at=_utc_now(),
    )


def _deduplicate(
    articles: list[NewsArticle],
) -> list[NewsArticle]:
    """
    Remove duplicate articles.
    Deduplication is primarily based on article_id.
    """
    seen = set()
    unique_articles = []
    for article in articles:
        if article.article_id in seen:
            continue
        seen.add(article.article_id)
        unique_articles.append(article)
    return unique_articles

# ==========================================================
# GNews Client
# ==========================================================
def _create_gnews() -> GNews:
    """
    Create the configured GNews client.
    """
    return GNews(
        language=GNEWS_LANGUAGE,
        country=GNEWS_COUNTRY,
        period=LOOKBACK,
        max_results=MAX_RESULTS_PER_QUERY,
    )

# ==========================================================
# Stock News
# ==========================================================
def fetch_stock_news(symbol: str,company_name: str,sector: Optional[str] = None,) -> list[NewsArticle]:
    """
    Fetch news for one stock.
    Example:
        symbol:
            HFCL.NS
        company_name:
            HFCL LIMITED
        sector:
            Technology
    The symbol is stored in our application.
    The company name is sent to GNews.
    """
    query = company_name.strip()
    news = _create_gnews()
    try:
        raw_articles = news.get_news(query)
    except Exception as exc:
        print(
            f"[NEWS] Stock fetch failed "
            f"for {symbol}: {exc}"
        )
        return []
    articles = []
    for raw_article in raw_articles[
        :MAX_RESULTS_PER_QUERY
    ]:

        article = _normalize_article(
            article=raw_article,
            category="stock",
            symbol=symbol,
            sector=sector,
            query=query,
        )
        if article:
            articles.append(article)
    return _deduplicate(articles)

# ==========================================================
# Sector News
# ==========================================================
def fetch_sector_news(sector: str,) -> list[NewsArticle]:
    """
    Fetch news related to an investment sector.
    Example:
        Technology
            ↓
        India Technology sector stocks
    """
    query = f"India {sector} sector stocks"
    news = _create_gnews()
    try:
        raw_articles = news.get_news(query)
    except Exception as exc:
        print(
            f"[NEWS] Sector fetch failed "
            f"for {sector}: {exc}"
        )
        return []
    articles = []
    for raw_article in raw_articles[
        :MAX_RESULTS_PER_QUERY
    ]:

        article = _normalize_article(
            article=raw_article,
            category="sector",
            sector=sector,
            query=query,
        )

        if article:
            articles.append(article)

    return _deduplicate(articles)


# ==========================================================
# Market News
# ==========================================================

def fetch_market_news() -> list[NewsArticle]:
    """
    Fetch overall Indian market / NIFTY 50 news.
    """

    query = '"NIFTY 50"'

    news = _create_gnews()

    try:
        raw_articles = news.get_news(query)

    except Exception as exc:
        print(
            f"[NEWS] Market fetch failed: {exc}"
        )
        return []

    articles = []

    for raw_article in raw_articles[
        :MAX_RESULTS_PER_QUERY
    ]:

        article = _normalize_article(
            article=raw_article,
            category="market",
            query=query,
        )

        if article:
            articles.append(article)

    return _deduplicate(articles)


# ==========================================================
# Storage
# ==========================================================

def _ensure_news_file() -> None:
    """
    Create the news JSON file if it doesn't exist.
    """
    NEWS_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )
    if not NEWS_FILE.exists():
        NEWS_FILE.write_text(
            "[]",
            encoding="utf-8",
        )


def _save_news(
    articles: list[NewsArticle],
) -> None:
    """
    Save normalized news articles to JSON.
    """
    _ensure_news_file()
    data = [
        article.model_dump(
            mode="json"
        )
        for article in articles
    ]
    NEWS_FILE.write_text(
        json.dumps(
            data,
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )


def _load_news() -> list[NewsArticle]:
    """
    Load previously stored news.
    """

    _ensure_news_file()

    try:

        raw_data = json.loads(
            NEWS_FILE.read_text(
                encoding="utf-8"
            )
        )

    except (json.JSONDecodeError, OSError):

        return []

    articles = []

    for item in raw_data:

        # ----------------------------------------------------------
        # Analyze sentiment for older articles that do not yet
        # have sentiment information.
        # ----------------------------------------------------------

        if not item.get("sentiment"):

            sentiment, sentiment_score = analyze_sentiment(
                item.get("title", "")
            )

            item["sentiment"] = sentiment
            item["sentiment_score"] = sentiment_score

        articles.append(
            NewsArticle(**item)
        )

    return articles


# ==========================================================
# News Service
# ==========================================================

class NewsService:
    """
    Main service used by the FastAPI router.
    """

    @staticmethod
    def get_all_news() -> list[NewsArticle]:
        """
        Return stored news.

        Automatically refresh news when the stored articles
        are older than 15 hours.
        """

        articles = _load_news()

        # No stored news → fetch immediately
        if not articles:
            return NewsService.refresh_news()

        # Find the latest fetch timestamp
        fetched_times = [
            article.fetched_at
            for article in articles
            if article.fetched_at is not None
        ]

        # If timestamps are unavailable, keep existing data
        if not fetched_times:
            return articles

        latest_fetched_at = max(fetched_times)

        # Make sure timestamp is timezone-aware
        if latest_fetched_at.tzinfo is None:
            latest_fetched_at = latest_fetched_at.replace(
                tzinfo=timezone.utc
            )

        age = _utc_now() - latest_fetched_at

        # Refresh only after 15 hours
        if age.total_seconds() >= 15 * 60 * 60:
            return NewsService.refresh_news()

        return articles

    @staticmethod
    def refresh_news() -> list[NewsArticle]:
        """
        Fetch and store fresh news.

        Sources:
            1. Invested stocks
            2. Invested sectors
            3. NIFTY 50 / market

        NOTE:
        Portfolio information will be connected here
        using the existing dashboard/portfolio data.
        """

        all_articles: list[NewsArticle] = []
        # --------------------------------------------------
        # TODO:
        # Connect this section to the existing portfolio
        # data from our dashboard.
        #
        # Expected structure:
        #
        # [
        #     {
        #         "symbol": "HFCL.NS",
        #         "company_name": "HFCL LIMITED",
        #         "sector": "Technology"
        #     }
        # ]
        # --------------------------------------------------

        try:
            portfolio = DashboardService.get_portfolio()

        except Exception as exc:
            print(
                f"[NEWS] Failed to load portfolio: {exc}"
            )
            portfolio = []
        print(portfolio)
        # --------------------------------------------------
        # Stock news
        # --------------------------------------------------

        for stock in portfolio:
            articles = fetch_stock_news(
                symbol=stock.symbol,
                company_name=stock.company_name,
                sector=stock.sector,
            )
            all_articles.extend(
                articles
            )
        # --------------------------------------------------
        # Unique sectors
        # --------------------------------------------------
        sectors = {
            stock.sector
            for stock in portfolio
            if stock.sector
        }

        for sector in sectors:
            articles = fetch_sector_news(
                sector=sector
            )
            all_articles.extend(
                articles
            )
        # --------------------------------------------------
        # Market / NIFTY news
        # --------------------------------------------------
        all_articles.extend(fetch_market_news())

        # --------------------------------------------------
        # Final deduplication
        # --------------------------------------------------

        all_articles = _deduplicate(all_articles)

        # --------------------------------------------------
        # Sort newest first
        # --------------------------------------------------

        all_articles.sort(
            key=lambda article: (
                article.published_at
                or datetime.min
            ),
            reverse=True,
        )

        # --------------------------------------------------
        # Store
        # --------------------------------------------------
        _save_news(all_articles)

        return all_articles