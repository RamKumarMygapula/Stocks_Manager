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

# Project Structure

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



### **Running the Application**

The application has two parts:

Backend - FastAPI
Frontend - React + Vite

Both need to be running.

1. Start Backend

Open PowerShell in:

D:\Stock Manager\stock_manager

Activate the Python virtual environment:

e.g: .venv\Scripts\Activate.ps1

If the virtual environment is already active, you will see:

(.venv)

in the terminal.

Then **start the FastAPI backend**:

uvicorn app.main:app --reload

The backend should run at:

http://127.0.0.1:8000

FastAPI documentation:

http://127.0.0.1:8000/docs

Keep this terminal running.

2. Start Frontend

Open a second PowerShell terminal.

Go to the frontend:

cd "D:\Stock Manager\stock_manager\frontend"

Install dependencies if needed:

npm install

Start the frontend:

**npm run dev**

The frontend should run at:

http://localhost:5173/

Open the frontend URL in the browser.

Quick Start
Terminal 1 - Backend
cd "D:\Stock Manager\stock_manager"
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
Terminal 2 - Frontend
cd "D:\Stock Manager\stock_manager\frontend"
npm run dev

Then open:

http://localhost:5173/
If Virtual Environment Does Not Exist

Create it from the project root:

python -m venv .venv

Activate it:

.venv\Scripts\Activate.ps1

Install backend dependencies:

pip install -r requirements.txt

Then start the backend:

uvicorn app.main:app --reload
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

The main development branch is:

dev

Check current branch:

git branch

Check status:

git status

Pull latest changes:

git pull origin dev

Add changes:

git add .

Commit changes:

git commit -m "your commit message"

Push changes:

git push origin dev
Current Development Workflow

When working on the project:

1. Open project
cd "D:\Stock Manager\stock_manager"
2. Start backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
3. Open another terminal
cd "D:\Stock Manager\stock_manager\frontend"
npm run dev
4. Develop

Make changes in:

backend/
frontend/
5. Check Git
git status
6. Commit
git add .
git commit -m "feat: description"
7. Push
git push origin dev
Notes
Backend and frontend must both be running for the Dashboard to work.
Do not commit .venv/.
Do not commit node_modules/.
Do not commit environment files containing secrets.
Keep development work on the dev branch.
Production/deployment workflow will be added later.
Future Work

The project is still under development.

Planned areas include:

Stock Analysis page
Fundamental analysis
Technical analysis
News and sentiment analysis
Custom ML model
LLM-based stock analysis
Portfolio performance analytics
Improved database architecture
Authentication
Deployment
Testing
Production documentation


### Then save it


From:


```text
D:\Stock Manager\stock_manager

run:

git add README.md
git commit -m "docs: add project setup instructions"
git push origin dev
