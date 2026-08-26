"""
repository.py

Handles persistence of news articles.

For now news is stored in JSON.
Later this can be replaced with PostgreSQL / Supabase
without changing the NewsService significantly.
"""

import json
from pathlib import Path

from app.news.schemas import NewsArticle


DATA_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "news.json"
)


class NewsRepository:

    @staticmethod
    def _ensure_file():
        DATA_FILE.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        if not DATA_FILE.exists():
            DATA_FILE.write_text(
                "[]",
                encoding="utf-8"
            )

    # ======================================================
    # Read
    # ======================================================

    @classmethod
    def get_all(cls) -> list[NewsArticle]:

        cls._ensure_file()

        try:

            with open(
                DATA_FILE,
                "r",
                encoding="utf-8"
            ) as file:

                data = json.load(file)

            if not isinstance(data, list):
                return []

            return [
                NewsArticle.model_validate(article)
                for article in data
            ]

        except (
            json.JSONDecodeError,
            OSError
        ):
            return []

    # ======================================================
    # Replace
    # ======================================================

    @classmethod
    def save_all(
        cls,
        articles: list[NewsArticle]
    ):

        cls._ensure_file()
        data = [
            article.model_dump(mode="json")
            for article in articles
        ]

        with open(
            DATA_FILE,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                data,
                file,
                indent=4,
                ensure_ascii=False
            )

    # ======================================================
    # Add
    # ======================================================

    @classmethod
    def add_articles(
        cls,
        new_articles: list[NewsArticle]
    ):

        existing = cls.get_all()

        existing_ids = {
            article.article_id
            for article in existing
        }

        for article in new_articles:

            if article.article_id not in existing_ids:

                existing.append(article)

                existing_ids.add(
                    article.article_id
                )

        cls.save_all(existing)