from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.dashboard.router import router as dashboard_router

app = FastAPI(
    title="Stock Manager API",
    version="1.0.0"
)
# =============================================================================
# CORS Configuration
# Allows the React frontend to communicate with FastAPI.
# =============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(dashboard_router)