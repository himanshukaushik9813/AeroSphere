# AeroSphere Deployment (Frontend + Backend)

This repo now contains:
- `./` -> Next.js frontend
- `./backend` -> Express + WebSocket backend

Use this flow for fastest deployment.

## 1) Deploy Backend (Render)

1. Go to Render -> New -> Web Service.
2. Connect this GitHub repo: `himanshukaushik9813/AeroSphere`.
3. Set:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables:
   - `OPENWEATHER_API_KEY=YOUR_REAL_KEY`
   - `FRONTEND_URLS=http://localhost:3000,http://localhost:3001`
   - `REDIS_URL=` (optional; keep empty unless using Redis)
5. Deploy and copy backend URL, for example:
   - `https://aerosphere-backend.onrender.com`

## 2) Deploy Frontend (Vercel)

1. Go to Vercel -> Add New Project.
2. Import same GitHub repo: `himanshukaushik9813/AeroSphere`.
3. Configure:
   - Framework: Next.js
   - Root Directory: `.`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL=https://aerosphere-backend.onrender.com/api`
   - `NEXT_PUBLIC_WS_URL=wss://aerosphere-backend.onrender.com/ws`
5. Deploy and copy frontend URL, for example:
   - `https://aerosphere.vercel.app`

## 3) Final CORS/WS hookup

Update backend env `FRONTEND_URLS` to include your real frontend domain:

`FRONTEND_URLS=https://aerosphere.vercel.app,http://localhost:3000,http://localhost:3001`

Then redeploy backend once.

## 4) Quick Production Checks

1. Backend health:
   - `https://aerosphere-backend.onrender.com/api/health`
2. Frontend loads and can fetch weather from globe click.
3. Browser console has no CORS or WS connection errors.
