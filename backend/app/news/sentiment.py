"""
sentiment.py

Sentiment analysis for news articles.

Uses NLTK VADER to classify news headlines as:
    positive
    negative
    neutral
"""

from nltk.sentiment import SentimentIntensityAnalyzer


# Create the analyzer once when the module is loaded.
# We don't want to create a new analyzer for every article.
_analyzer = SentimentIntensityAnalyzer()


def analyze_sentiment(text: str) -> tuple[str, float]:
    """
    Analyze the sentiment of a news headline.

    Args:
        text: News title/headline.

    Returns:
        Tuple containing:
            sentiment label
            compound sentiment score
    """

    if not text or not text.strip():
        return "neutral", 0.0

    scores = _analyzer.polarity_scores(text)

    compound_score = scores["compound"]

    if compound_score >= 0.05:
        sentiment = "positive"

    elif compound_score <= -0.05:
        sentiment = "negative"

    else:
        sentiment = "neutral"

    return sentiment, compound_score