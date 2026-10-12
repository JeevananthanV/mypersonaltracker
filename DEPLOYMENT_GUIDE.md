# 🚀 Deployment Guide: Jeeva's Life OS (Vercel + Render + MongoDB Atlas)

This repository is pre-configured for production deployment:
- **Frontend (React + Vite)**: Optimized for **Vercel** with [vercel.json](file:///j:/jeeva/mypersonaltracker/vercel.json).
- **Backend (Node.js + Express)**: Optimized for **Render** with [render.yaml](file:///j:/jeeva/mypersonaltracker/render.yaml).
- **Database (MongoDB Atlas)**: Cloud-hosted MongoDB database (`jeeva_life_os`).

---

## 🟢 Part 1: Deploy Backend on Render (Free Tier)

1. Go to [render.com](https://render.com) and log in with your GitHub account.
2. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Jeeva Life OS with MongoDB Atlas backend"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
3. In Render Dashboard, click **New +** → **Web Service**.
4. Select your GitHub repository.
5. Configure the service settings:
   - **Name**: `jeeva-life-os-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. Add the following **Environment Variables** in Render:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `MONGODB_USERNAME` | `jeevananthanjeeva170902_db_user` |
   | `MONGODB_PASSWORD` | `GoMr3MKte7XKQ1CF` |
   | `MONGODB_URI` | `mongodb+srv://jeevananthanjeeva170902_db_user:GoMr3MKte7XKQ1CF@cluster0.pfth5pc.mongodb.net` |
   | `MONGODB_DB_NAME` | `jeeva_life_os` |
   | `CLIENT_URL` | `https://your-frontend-app.vercel.app` (or `*` temporarily) |
7. Click **Create Web Service**.
8. Once deployed, copy your Render public URL (e.g., `https://jeeva-life-os-api.onrender.com`).

---

## ⚡ Part 2: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. Framework Preset will automatically detect **Vite**.
5. In **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://jeeva-life-os-api.onrender.com` (Your Render backend URL from Part 1) |
6. Click **Deploy**.
7. Vercel will build and launch your site with a live `.vercel.app` domain in seconds!

---

## 🔒 MongoDB Atlas Network Access Note

In your [MongoDB Atlas Dashboard](https://cloud.mongodb.com):
1. Navigate to **Network Access**.
2. Click **Add IP Address**.
3. Select **Allow Access from Anywhere (`0.0.0.0/0`)** so Render can connect to your database from the cloud.
4. Click **Confirm**.

---

## 💻 Local Development Commands

```bash
# Start frontend (port 5173)
npm run dev

# Start backend (port 5000)
npm run server

# Re-seed MongoDB database
npm run server:seed
```
