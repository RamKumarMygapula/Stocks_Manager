import os
import warnings

import numpy as np
import pandas as pd
import yfinance as yf
from tqdm import tqdm

from ta.momentum import RSIIndicator
from ta.trend import MACD, EMAIndicator, SMAIndicator

warnings.filterwarnings("ignore")

# -------------------------------------------------------
# CONFIGURATION
# -------------------------------------------------------

START_DATE = "2022-01-01"
END_DATE = "2023-12-31"

INPUT_FILE = "../input/stocks.csv"
OUTPUT_FILE = "../output/monthly_price_features.csv"

os.makedirs("../output", exist_ok=True)

# -------------------------------------------------------
# READ STOCKS
# -------------------------------------------------------

stocks = pd.read_csv(INPUT_FILE)
symbols = stocks["Symbol"].dropna().tolist()

all_data = []

# -------------------------------------------------------
# DOWNLOAD DATA
# -------------------------------------------------------

for symbol in tqdm(symbols):

    print(f"\nDownloading {symbol}")

    try:

        df = yf.download(
            symbol,
            start=START_DATE,
            end=END_DATE,
            interval="1d",
            auto_adjust=False,
            progress=False,
            group_by="column"
        )

        if df.empty:
            print("No data")
            continue

        # ----------------------------------------
        # FIX NEW YFINANCE MULTIINDEX
        # ----------------------------------------

        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # keep only required columns

        cols = ["Open", "High", "Low", "Close", "Volume"]

        df = df[cols].copy()

        # convert every column to Series

        for c in cols:
            df[c] = pd.to_numeric(df[c], errors="coerce")

        close = df["Close"]

        # ----------------------------------------
        # TECHNICAL INDICATORS
        # ----------------------------------------

        df["RSI"] = RSIIndicator(close=close, window=14).rsi()

        macd = MACD(close=close)

        df["MACD"] = macd.macd()

        df["SMA50"] = SMAIndicator(close=close, window=50).sma_indicator()

        df["EMA20"] = EMAIndicator(close=close, window=20).ema_indicator()

        # ----------------------------------------
        # RETURNS
        # ----------------------------------------

        df["Daily_Return"] = close.pct_change()

        df["Volatility"] = (
            df["Daily_Return"]
            .rolling(21)
            .std()
            * np.sqrt(21)
        )

        # ----------------------------------------
        # 52 WEEK HIGH LOW
        # ----------------------------------------

        df["52W_High"] = df["High"].rolling(252).max()

        df["52W_Low"] = df["Low"].rolling(252).min()

        # ----------------------------------------
        # MONTHLY AGGREGATION
        # ----------------------------------------

        monthly = pd.DataFrame()

        monthly["Open"] = df["Open"].resample("ME").first()

        monthly["High"] = df["High"].resample("ME").max()

        monthly["Low"] = df["Low"].resample("ME").min()

        monthly["Close"] = df["Close"].resample("ME").last()

        monthly["Volume"] = df["Volume"].resample("ME").sum()

        monthly["RSI"] = df["RSI"].resample("ME").last()

        monthly["MACD"] = df["MACD"].resample("ME").last()

        monthly["SMA50"] = df["SMA50"].resample("ME").last()

        monthly["EMA20"] = df["EMA20"].resample("ME").last()

        monthly["Volatility"] = df["Volatility"].resample("ME").last()

        monthly["52W_High"] = df["52W_High"].resample("ME").last()

        monthly["52W_Low"] = df["52W_Low"].resample("ME").last()

        monthly["Returns"] = monthly["Close"].pct_change()

        monthly.reset_index(inplace=True)

        monthly["Stock"] = symbol

        all_data.append(monthly)

        print("Done")

    except Exception as e:

        print(symbol)

        print(e)

# -------------------------------------------------------
# SAVE
# -------------------------------------------------------

if len(all_data) == 0:
    print("No data downloaded.")
    exit()

final_df = pd.concat(all_data, ignore_index=True)

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

final_df.to_csv(OUTPUT_FILE, index=False)

print("\n----------------------------------")
print(final_df.head())
print("----------------------------------")

print(f"\nSaved to {OUTPUT_FILE}")
