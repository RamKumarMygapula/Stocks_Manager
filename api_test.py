import json
import requests


def get_stock_data(stock_name, api_key):
    # API Endpoint for getting stock information
    url = "https://stock.indianapi.in/stock"

    # Query parameters required by the API
    params = {"name": stock_name}

    # Request headers containing your API key
    headers = {"x-api-key": api_key, "Content-Type": "application/json"}

    try:
        # Making the GET request
        response = requests.get(url, headers=headers, params=params)

        # Check if the request was successful
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error {response.status_code}: {response.text}")
            return None

    except Exception as e:
        print(f"An error occurred: {e}")
        return None


def save_to_json(data, filename="stock_data.json"):
    """Saves dictionary data to a formatted JSON file."""
    try:
        with open(filename, "w", encoding="utf-8") as file:
            # indent=4 formats the JSON nicely with indents so it's readable
            json.dump(data, file, indent=4, ensure_ascii=False)
        print(f"Data successfully saved to {filename}")
    except Exception as e:
        print(f"Failed to save JSON file: {e}")


# ==================== TESTING THE API ====================
if __name__ == "__main__":
    # Insert your REGENERATED API key here
    API_KEY = "sk-live-EhZG851l8KcKdJygw6NyM7dkjC1VFt09S4M8lakD"

    STOCK_NAME = "Tata Steel"

    # Fetch stock details
    stock_info = get_stock_data(STOCK_NAME, API_KEY)

    if stock_info:
        print("API Response Received Successfully!\n")

        # Create a dynamic filename (e.g., "tata_steel_stock_data.json")
        file_name = f"{STOCK_NAME.lower().replace(' ', '_')}_data.json"

        # Save to JSON file
        save_to_json(stock_info, file_name)