import json
import yfinance as yf


def get_stock_details(symbol: str, exchange: str = "NS"):
    """Fetches real-time stock information using yfinance and exports it to JSON.

    :param symbol: Stock ticker symbol (e.g., 'TATASTEEL', 'RELIANCE', 'INFY')
    :param exchange: 'NS' for National Stock Exchange, 'BO' for Bombay Stock
    Exchange
    """
    ticker_symbol = f"{symbol}.{exchange}"
    print(f"Fetching data for: {ticker_symbol}...")

    # Fetch stock object
    stock = yf.Ticker(ticker_symbol)

    # 1. Fetch live market price info using fast_info
    fast_info = stock.fast_info

    # 2. Fetch full metadata & financial fundamentals
    info = stock.info

    # Structure data safely using .get() to prevent missing key errors
    stock_payload = {
        "ticker": ticker_symbol,
        "company_name": info.get("shortName")
        or info.get("longName")
        or "N/A",
        "currency": fast_info.get("currency", "INR"),
        "price_summary": {
            "last_price": round(fast_info.get("lastPrice", 0), 2),
            "previous_close": round(fast_info.get("previousClose", 0), 2),
            "day_high": round(fast_info.get("dayHigh", 0), 2),
            "day_low": round(fast_info.get("dayLow", 0), 2),
            "fifty_two_week_high": round(fast_info.get("yearHigh", 0), 2),
            "fifty_two_week_low": round(fast_info.get("yearLow", 0), 2),
        },
        "key_metrics": {
            "market_cap": fast_info.get("marketCap"),
            "pe_ratio": info.get("trailingPE"),
            "pb_ratio": info.get("priceToBook"),
            "x": info.get("trailingEps"),
        },
        "sector": info.get("sector", "N/A"),
        "industry": info.get("industry", "N/A"),
    }

    # Save to JSON file
    filename = f"{symbol.lower()}_data.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(stock_payload, f, indent=4, ensure_ascii=False)

    print(f"Successfully saved stock data to '{filename}'\n")
    return stock_payload


if __name__ == "__main__":
    # Test Tata Steel (NSE)
    data = get_stock_details("TATASTEEL", exchange="NS")

    # Output preview in console
    print("--- Console Preview ---")
    print(f"Company: {data['company_name']}")
    print(f"Live Price: ₹{data['price_summary']['last_price']}")
    print(f"52-Week High: ₹{data['price_summary']['fifty_two_week_high']}")