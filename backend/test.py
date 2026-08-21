"""
Test Dashboard Service
"""

from pprint import pprint

from app.dashboard.service import DashboardService

dashboard = DashboardService.get_dashboard()

print("\n")

print("=" * 100)
print("SUMMARY")
print("=" * 100)

pprint(dashboard.summary.model_dump())

print("\n")

print("=" * 100)
print("PORTFOLIO")
print("=" * 100)

for stock in dashboard.portfolio:

    pprint(stock.model_dump())

    print()

print("=" * 100)
print("SECTOR DISTRIBUTION")
print("=" * 100)

for sector in dashboard.sector_distribution:

    pprint(sector.model_dump())