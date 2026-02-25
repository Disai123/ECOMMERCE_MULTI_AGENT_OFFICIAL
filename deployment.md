# Deployment Guide: E-commerce Multi-Agent Platform

This guide provides instructions for deploying the full-stack application.

## 1. Prerequisites
- Python 3.11+
- Node.js & npm
- PostgreSQL database (or a cloud provider like Neon/RDS)
- OpenAI API Key (or equivalent for LangGraph)

## 2. Backend Deployment (FastAPI)

### Step 1: Environment Setup
Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
SECRET_KEY=your_super_secret_key
ALGORITHM=HS256
OPENAI_API_KEY=sk-proj-xxxx
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run with Uvicorn
For production:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 3. Frontend Deployment (React + Vite)

### Step 1: Configure API URL
Update `src/api.js` or `.env` to point to the backend URL:
```env
VITE_API_BASE_URL=https://your-backend-url.com
```

### Step 2: Build and Deploy
```bash
npm install
npm run build
```
Deploy the contents of the `dist/` folder to a static hosting provider (Vercel, Netlify, or Render Static Site).

## 4. Database Setup
Ensure tables are created by running the app once (FastAPI's `Base.metadata.create_all` will handle it) or use Alembic for migrations.
To seed initial data:
```bash
python seed.py
```

## 5. Deployment Checklist
- [ ] CORS is configured in `main.py` to allow the frontend domain.
- [ ] `SECRET_KEY` is a long, random string.
- [ ] API keys are stored as secrets, not committed to Git.
- [ ] Database is accessible from the production environment.
