"""
Dashboard Router

Exposes Dashboard and Portfolio APIs.
"""

from fastapi import APIRouter, HTTPException

from app.dashboard.schemas import (
    CreatePortfolio,
    UpdatePortfolio,
)
from app.dashboard.service import DashboardService

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# ==========================================================
# Summary API
# ==========================================================

@router.get("/summary")
def get_summary():
    """
    Dashboard summary.
    """
    return DashboardService.get_summary()
# ==========================================================
# Dashboard APIs
# ==========================================================

@router.get("")
def get_dashboard():
    """
    Complete dashboard response.
    """
    return DashboardService.get_dashboard()


# ==========================================================
# Portfolio APIs
# ==========================================================

@router.get("/portfolio")
def get_portfolio():

    return DashboardService.get_portfolio()


@router.post("/portfolio")
def add_stock(stock: CreatePortfolio):
    return DashboardService.add_stock(stock)


@router.put("/portfolio/{portfolio_id}")
def update_stock(
    portfolio_id: int,
    stock: UpdatePortfolio
):
    try:
        return DashboardService.update_stock(
            portfolio_id,
            stock
        )
    except Exception as ex:
        raise HTTPException(
            status_code=404,
            detail=str(ex)
        )


@router.delete("/portfolio/{portfolio_id}")
def delete_stock(portfolio_id: int):
    deleted = DashboardService.delete_stock(
        portfolio_id
    )
    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Portfolio not found."
        )
    return {
        "message": "Deleted Successfully"
    }