export type NewsCategory = "stock" | "sector" | "market";

export interface NewsArticle {
  article_id: string;
  category: NewsCategory;

  symbol: string | null;
  sector: string | null;

  query: string;
  title: string;

  sentiment?: "positive" | "negative" | "neutral";
  sentiment_score?: number;
  
  source: string | null;

  published_at: string | null;

  google_news_url: string | null;

  fetched_at: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  total: number;
}