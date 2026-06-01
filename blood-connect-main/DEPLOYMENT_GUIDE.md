# Complete Deployment Guide for Blood Connect

## Overview
- **Frontend**: Deployed to Vercel (React/Vite)
- **Backend**: Deployed to Render.com (Express.js)

---

## Part 1: Deploy Frontend to Vercel

### Step 1: Create a Frontend GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `blood-connect-frontend`
3. Make it **Public** or **Private** (your choice)
4. **Don't initialize with README**

### Step 2: Push Frontend Code to GitHub
```bash
cd blood-connect-main/frontend
git init
git add .
git commit -m "Initial frontend setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blood-connect-frontend.git
git push -u origin main
```

### Step 3: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Select your `blood-connect-frontend` repository
4. **Framework**: Select **"Vite"** (if it doesn't auto-detect)
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-backend-url.render.com` (add this after backend is deployed)
8. Click **"Deploy"**

✅ Your frontend is live! Vercel will give you a URL like `https://blood-connect-frontend.vercel.app`

---

## Part 2: Deploy Backend to Render.com

### Step 1: Create a Backend GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `blood-connect-backend`
3. Make it **Public**
4. **Don't initialize with README**

### Step 2: Push Backend Code to GitHub
```bash
cd ../backend
git init
git add .
git commit -m "Initial backend setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blood-connect-backend.git
git push -u origin main
```

### Step 3: Deploy Backend to Render
1. Go to [render.com](https://render.com) and sign up/login with GitHub
2. Click **"+ New +"** → **"Web Service"**
3. Connect your GitHub account if needed
4. Select `blood-connect-backend` repository
5. Fill in the deployment form:
   - **Name**: `blood-connect-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

### Step 4: Add Environment Variables in Render
After deployment starts, go to your service:
1. Click on your service name
2. Go to **"Environment"** tab
3. Add these environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: `production`
   - `PORT`: `3000`

✅ Your backend is live! Render will give you a URL like `https://blood-connect-backend.onrender.com`

---

## Part 3: Connect Frontend to Backend

### Update Frontend Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your `blood-connect-frontend` project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL` to your Render backend URL:
   ```
   https://blood-connect-backend.onrender.com
   ```
5. Redeploy the project (go to Deployments → click the latest → Redeploy)

### Update Frontend Code (if needed)
Make sure your frontend is using the environment variable correctly:

In your API calls (e.g., `src/api/client.ts` or similar):
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_URL,
});
```

---

## Part 4: Important Configuration

### Backend CORS Setup
Make sure your backend has CORS configured to allow your Vercel frontend URL:

In `backend/server.js`:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://blood-connect-frontend.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true,
}));
```

### MongoDB Setup
- If using MongoDB Atlas (cloud):
  - Get your connection string from [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
  - Add it as `MONGODB_URI` environment variable in Render

- If using local MongoDB:
  - You'll need to migrate to MongoDB Atlas (free tier available)
  - Or use another MongoDB cloud service

---

## Testing Your Deployment

1. Visit your Vercel frontend URL
2. Check if the website loads without 404 errors
3. Try making API calls (login, create request, etc.)
4. Check Render logs if something fails: **Render Dashboard** → Your service → **Logs**

---

## Troubleshooting

### 404 Errors
- Check if backend URL is correct in frontend environment variables
- Verify backend is running (check Render logs)
- Check CORS settings in backend

### Backend Connection Issues
- Verify MongoDB URI is correct
- Check JWT_SECRET is set in environment
- Check Render logs for error messages

### Slow Performance on Free Tier
- Free tiers on both Vercel and Render have cold start delays
- Consider upgrading when you go live

---

## Next Steps
1. Set up proper MongoDB instance
2. Configure email notifications
3. Add monitoring/logging
4. Set up custom domain names
5. Enable HTTPS (both platforms do this by default)
