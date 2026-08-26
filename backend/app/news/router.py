"""
router.py

FastAPI routes for the News module.
"""

from fastapi import APIRouter

from app.news.schemas import NewsResponse
from app.news.service import NewsService


router = APIRouter(
    prefix="/news",
    tags=["News"]
)


# ==========================================================
# Get Stored News
# ==========================================================

@router.get(
    "",
    response_model=NewsResponse
)
def get_news():

    articles = NewsService.get_all_news()

    return NewsResponse(
        articles=articles,
        total=len(articles)
    )


# ==========================================================
# Refresh News
# ==========================================================

@router.post(
    "/refresh",
    response_model=NewsResponse
)
def refresh_news():

    articles = NewsService.refresh_news()

    return NewsResponse(
        articles=articles,
        total=len(articles)
    )