import pandas as pd
import numpy as np
import yfinance as yf
import pandas_ta as ta
from tqdm import tqdm
import os

# -------------------------------
# Configuration
# -------------------------------

START_DATE = "2022-01-01"
END_DATE = "2023-12-31"

INPUT_FILE = "../input/stocks.csv"

OUTPUT_FILE = "../output/monthly_price_features.csv"

os.makedirs("../output", exist_ok=True)

# -------------------------------
# Read Stock List
# -------------------------------

stocks = pd.read_csv(INPUT_FILE)

symbols = stocks["Symbol"].tolist()

all_data = []

# -------------------------------
# Loop through Stocks
# -------------------------------

for symbol in tqdm(symbols):

    try:

        print(f"\nDownloading {symbol}")

        df = yf.download(
            symbol,
            start=START_DATE,
            end=END_DATE,
            interval="1d",
            progress=False,
            auto_adjust=False
        )

        if df.empty:
            continue

        # ---------------------------
        # Technical Indicators
        # ---------------------------

        df["RSI"] = ta.rsi(df["Close"], length=14)

        macd = ta.macd(df["Close"])

        df["MACD"] = macd["MACD_12_26_9"]

        df["SMA50"] = ta.sma(df["Close"], length=50)

        df["EMA20"] = ta.ema(df["Close"], length=20)

        # Daily Returns

        df["Daily_Return"] = df["Close"].pct_change()

        # Monthly Volatility (21 trading days)

        df["Volatility"] = (
            df["Daily_Return"]
            .rolling(21)
            .std()
            * np.sqrt(21)
        )

        # Rolling 52-week High/Low

        df["52W_High"] = (
            df["High"]
            .rolling(252)
            .max()
        )

        df["52W_Low"] = (
            df["Low"]
            .rolling(252)
            .min()
        )

        # ---------------------------
        # Convert to Monthly
        # ---------------------------

        monthly = pd.DataFrame()

        monthly["Open"] = df["Open"].resample("M").first()

        monthly["High"] = df["High"].resample("M").max()

        monthly["Low"] = df["Low"].resample("M").min()

        monthly["Close"] = df["Close"].resample("M").last()

        monthly["Volume"] = df["Volume"].resample("M").sum()

        monthly["RSI"] = df["RSI"].resample("M").last()

        monthly["MACD"] = df["MACD"].resample("M").last()

        monthly["SMA50"] = df["SMA50"].resample("M").last()

        monthly["EMA20"] = df["EMA20"].resample("M").last()

        monthly["Volatility"] = df["Volatility"].resample("M").last()

        monthly["52W_High"] = df["52W_High"].resample("M").last()

        monthly["52W_Low"] = df["52W_Low"].resample("M").last()

        monthly["Returns"] = (
            monthly["Close"]
            .pct_change()
        )

        monthly.reset_index(inplace=True)

        monthly["Stock"] = symbol

        all_data.append(monthly)

    except Exception as e:

        print(symbol, e)

# -------------------------------
# Merge All Stocks
# -------------------------------

final_df = pd.concat(all_data, ignore_index=True)

# -------------------------------
# Reorder Columns
# -------------------------------

final_df = final_df[
    [
        "Date",
        "Stock",
        "Open",
        "High",
        "Low",
        "Close",
        "Volume",
        "Returns",
        "RSI",
        "MACD",
        "SMA50",
        "EMA20",
        "Volatility",
        "52W_High",
        "52W_Low",
    ]
]

# -------------------------------
# Save
# -------------------------------

final_df.to_csv(OUTPUT_FILE, index=False)

print("\nDone")

print(final_df.head())

print(f"\nSaved to {OUTPUT_FILE}")