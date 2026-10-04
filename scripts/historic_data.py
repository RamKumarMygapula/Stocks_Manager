import time
import requests
import pandas as pd
from tqdm import tqdm

# ======================================================
# CONFIGURATION
# ======================================================

API_KEY = "1atSrxEgKWLwF5nL8WQCl8AIGHMpqRQw"   # <-- Replace with your FMP API key

BASE_URL = "https://financialmodelingprep.com/api/v3"

INPUT_FILE = "../input/stocks.csv"
OUTPUT_FILE = "../output/fundamentals.csv"

# ======================================================
# READ STOCKS
# ======================================================

stocks = pd.read_csv(INPUT_FILE)

all_rows = []

# ======================================================
# DOWNLOAD DATA
# ======================================================

for symbol in tqdm(stocks["Symbol"]):

    # FMP uses RELIANCE instead of RELIANCE.NS
    ticker = symbol.replace(".NS", "")

    print(f"\nDownloading {ticker}")

    try:

        # -------------------------------
        # Income Statement
        # -------------------------------
        print(f"Downloading income statement for {ticker}")

        income_url = (
            f"{BASE_URL}/income-statement/{ticker}"
            f"?period=quarter&limit=20&apikey={API_KEY}"
        )
        print(f"URL: {income_url}")
        income = requests.get(income_url).json()
        print(f"Income statement: {len(income)} {income[0]['symbol']} rows")
        # -------------------------------
        # Balance Sheet
        # -------------------------------

        balance_url = (
            f"{BASE_URL}/balance-sheet-statement/{ticker}"
            f"?period=quarter&limit=20&apikey={API_KEY}"
        )
        print(f"URL: {balance_url}")
        balance = requests.get(balance_url).json()

        if not income or not balance:
            print("No data found")
            continue

        balance_lookup = {
            item["date"]: item
            for item in balance
        }

        for item in income:

            date = item["date"]

            if date not in balance_lookup:
                continue

            bal = balance_lookup[date]

            revenue = item.get("revenue")
            net_income = item.get("netIncome")
            eps = item.get("eps")

            total_debt = bal.get("totalDebt")
            total_equity = bal.get("totalStockholdersEquity")

            # Debt / Equity
            if total_equity and total_equity != 0:
                debt_equity = total_debt / total_equity
            else:
                debt_equity = None

            # ROE
            if total_equity and total_equity != 0:
                roe = net_income / total_equity
            else:
                roe = None

            all_rows.append({

                "Stock": symbol,

                "Date": date,

                "Revenue": revenue,

                "NetIncome": net_income,

                "EPS": eps,

                "TotalDebt": total_debt,

                "TotalEquity": total_equity,

                "DebtEquity": debt_equity,

                "ROE": roe

            })

        time.sleep(0.4)

    except Exception as e:

        print(e)

# ======================================================
# SAVE
# ======================================================

df = pd.DataFrame(all_rows)

df["Date"] = pd.to_datetime(df["Date"])

df = df.sort_values(["Stock", "Date"])

df.to_csv(OUTPUT_FILE, index=False)

print("\nFinished")

print(df.head())

print("\nRows:", len(df))