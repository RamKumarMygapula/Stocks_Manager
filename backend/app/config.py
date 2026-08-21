"""
Application configuration.

Central place for all file paths and application settings.
(Later, if we move the file or switch to a database, we only change one place.)
"""

from pathlib import Path

# Root directory (backend/app)
BASE_DIR = Path(__file__).resolve().parent

# Data directory
DATA_DIR = BASE_DIR / "data"

# Portfolio JSON file
PORTFOLIO_FILE = DATA_DIR / "portfolio.json"