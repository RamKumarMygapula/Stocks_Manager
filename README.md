# Stocks Manager

A stock portfolio management application with a React frontend and FastAPI backend.

## Current Status

### Dashboard

The Dashboard currently supports:

- Portfolio holdings table
- Add Stock
- Edit Stock
- Delete Stock
- View Stock details
- Portfolio summary cards
- Portfolio insights
- Sector allocation chart
- Dark mode
- Live market data
- Profit/Loss calculations
- Return percentage calculations
- Days invested
- Investment and current portfolio value

---
### **Running the Application**

The application has two parts:

- Backend - FastAPI
- Frontend - React + Vite
Both needs to be running.

1. Start Backend

Open PowerShell in:
D:\Stock Manager\stock_manager

Activate the Python virtual environment:
e.g: .venv\Scripts\Activate.ps1
If the virtual environment is already active, you will see: (.venv) in the terminal.

Then **start the FastAPI backend**:

_uvicorn app.main:app --reload_

The backend should run at: http://127.0.0.1:8000

FastAPI documentation: http://127.0.0.1:8000/docs

Keep this terminal running.

2. Start Frontend

Open a second PowerShell terminal.

Go to the frontend: cd "D:\Stock Manager\stock_manager\frontend"

Install dependencies if needed:
npm install

**Start the frontend**
_npm run dev_

The frontend should run at: http://localhost:5173/

Open the frontend URL in the browser.






Install backend dependencies: pip install -r requirements.txt

Then start the backend: uvicorn app.main:app --reload

Frontend Dependencies
The frontend is built using:

React
TypeScript
Vite
Material UI
MUI X Data Grid
Axios
TanStack React Query
Recharts

Install frontend dependencies with:

cd frontend
npm install

Run frontend:

npm run dev
Backend Dependencies

The backend uses Python and FastAPI.

Install dependencies:

pip install -r requirements.txt

Run backend:

uvicorn app.main:app --reload
Important URLs
Service	URL
Frontend	http://localhost:5173/
Backend	http://127.0.0.1:8000
FastAPI Docs	http://127.0.0.1:8000/docs
Git Commands


### Project Structure

```text
stock_manager/
│
├── backend/
│   ├── app/
│   │   ├── dashboard/
│   │   └── ...
│   │
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── requirements.txt
├── .gitignore
└── README.md
```text

