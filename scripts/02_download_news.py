import requests
import pandas as pd
from tqdm import tqdm
from datetime import datetime
import time

# ======================================================
# CONFIGURATION
# ======================================================

API_KEY = "d9n3gj9r01qlajg38u6gd9n3gj9r01qlajg38u70"

INPUT_FILE = "../input/stocks.csv"

OUTPUT_FILE = "../output/news_raw.csv"

START_DATE = "2022-01-01"
END_DATE = "2023-12-31"

# ======================================================

stocks = pd.read_csv(INPUT_FILE)

all_news = []

# ======================================================

for _, row in tqdm(stocks.iterrows(), total=len(stocks)):

    symbol = row["Symbol"]
    company = row["Company"]

    print(f"\nDownloading news for {company}")

    url = (
        "https://finnhub.io/api/v1/company-news"
        f"?symbol={symbol.replace('.NS','')}"
        f"&from={START_DATE}"
        f"&to={END_DATE}"
        f"&token={API_KEY}"
    )

    try:

        response = requests.get(url)

        if response.status_code != 200:
            print("HTTP Error:", response.status_code)
            continue

        articles = response.json()

        if not isinstance(articles, list):

            print(articles)
            continue

        print(f"Found {len(articles)} articles")

        for article in articles:

            all_news.append({

                "Stock": symbol,

                "Company": company,

                "Date": datetime.utcfromtimestamp(
                    article["datetime"]
                ).strftime("%Y-%m-%d"),

                "Headline": article.get("headline", ""),

                "Summary": article.get("summary", ""),

                "Source": article.get("source", ""),

                "Category": article.get("category", ""),

                "URL": article.get("url", "")

            })

        time.sleep(1)

    except Exception as e:

        print(e)

# ======================================================

df = pd.DataFrame(all_news)

df.to_csv(OUTPUT_FILE, index=False)

print("\nFinished")

print(df.head())

print("Rows :", len(df))