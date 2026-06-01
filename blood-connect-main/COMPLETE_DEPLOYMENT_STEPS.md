# Blood Connect - Deployment Checklist & Step-by-Step Instructions

## 📋 Pre-Deployment Checklist

### Frontend Requirements
- [ ] Node.js and npm installed
- [ ] All dependencies updated
- [ ] Environment variables configured
- [ ] Build command tested locally

### Backend Requirements
- [ ] Node.js and npm installed
- [ ] MongoDB Atlas account created
- [ ] All environment variables ready
- [ ] CORS settings configured

---

## 🚀 COMPLETE DEPLOYMENT GUIDE

### **STEP 1: Prepare Your Local Environment**

#### 1.1 Install Required Tools
```bash
# Make sure you have Node.js and Git installed
node --version
npm --version
git --version
```

#### 1.2 Set Up MongoDB Atlas (Free)
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user:
   - Go to **Database Access** → **Add New Database User**
   - Username: `bloodconnect`
   - Password: Generate secure password
5. Get connection string:
   - Go to **Databases** → **Connect** → **Drivers**
   - Copy the MongoDB connection string
   - Replace `<password>` with your user password
   - Example: `mongodb+srv://bloodconnect:password@cluster0.xxxxx.mongodb.net/blood-connect?retryWrites=true&w=majority`

#### 1.3 Generate JWT Secret
```bash
# On macOS/Linux/PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Save this output - you'll need it later
```

---

### **STEP 2: Create Separate GitHub Repositories**

#### 2.1 Create Frontend Repository
1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: `blood-connect-frontend`
3. **Description**: Blood Connect - Frontend (React + Vite)
4. Choose: **Public** or **Private**
5. **Don't** initialize with README
6. Click **"Create repository"**

#### 2.2 Create Backend Repository
1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: `blood-connect-backend`
3. **Description**: Blood Connect - Backend (Express + Node.js)
4. Choose: **Public**
5. **Don't** initialize with README
6. Click **"Create repository"**

---

### **STEP 3: Push Frontend Code to GitHub**

```bash
# Navigate to frontend directory
cd blood-connect-main/blood-connect-main/frontend

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: Initial frontend setup for Vercel deployment"

# Rename branch to main
git branch -M main

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/blood-connect-frontend.git

# Push to GitHub
git push -u origin main
```

✅ Visit `https://github.com/YOUR_USERNAME/blood-connect-frontend` to verify

---

### **STEP 4: Push Backend Code to GitHub**

```bash
# Navigate to backend directory
cd ../backend

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: Initial backend setup for Render deployment"

# Rename branch to main
git branch -M main

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/blood-connect-backend.git

# Push to GitHub
git push -u origin main
```

✅ Visit `https://github.com/YOUR_USERNAME/blood-connect-backend` to verify

---

### **STEP 5: Deploy Backend to Render.com**

#### 5.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Click **"Sign up"**
3. Sign up with GitHub account (recommended)
4. Authorize Render to access your GitHub

#### 5.2 Deploy Backend Service
1. Click **"+ New +"** button in top-right
2. Select **"Web Service"**
3. Select your `blood-connect-backend` repository
4. **If connecting GitHub for first time**: Click "Connect GitHub" and authorize

#### 5.3 Configure Deployment Settings
Fill in the form:
- **Name**: `blood-connect-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Plan**: Select **"Free"**

#### 5.4 Add Environment Variables
Before deploying, scroll to **Environment** section and add:

```
MONGODB_URI = mongodb+srv://bloodconnect:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/blood-connect?retryWrites=true&w=majority

JWT_SECRET = your_generated_secret_key_here

NODE_ENV = production

PORT = 3000

FRONTEND_URL = https://blood-connect-frontend.vercel.app

CORS_ORIGIN = https://blood-connect-frontend.vercel.app,http://localhost:5173

ADMIN_EMAIL = admin@sengodai.org

ADMIN_PASSWORD = YourSecurePassword123!

ADMIN_NAME = Admin User

ADMIN_PHONE = 9876543210

ADMIN_LOCATION = Tirunelveli

ADMIN_BLOODGROUP = O+
```

#### 5.5 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (2-3 minutes)
3. You'll get a URL like: `https://blood-connect-backend.onrender.com`
4. Save this URL! ⭐

#### 5.6 Verify Backend
- Go to your Render service URL
- Check **Logs** tab for any errors
- Should show "Server running on port 3000"

---

### **STEP 6: Deploy Frontend to Vercel**

#### 6.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your GitHub

#### 6.2 Import Frontend Project
1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find and select `blood-connect-frontend`
4. Click **"Import"**

#### 6.3 Configure Project Settings
- **Framework Preset**: Select **"Vite"** (if not auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `./` (default is fine)

#### 6.4 Add Environment Variables
In the **Environment Variables** section, add:

```
Name: VITE_API_URL
Value: https://blood-connect-backend.onrender.com
```

#### 6.5 Deploy
1. Click **"Deploy"**
2. Wait for build and deployment (2-5 minutes)
3. You'll get a URL like: `https://blood-connect-frontend.vercel.app`
4. Click the URL to visit your site! 🎉

---

### **STEP 7: Connect Frontend & Backend**

#### 7.1 Verify Backend is Working
```bash
# Test backend API endpoint
curl https://blood-connect-backend.onrender.com/api/health
```

#### 7.2 Update Vercel Environment Variable
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `blood-connect-frontend` project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL`:
   - Value: `https://blood-connect-backend.onrender.com`
5. Click **"Save"**

#### 7.3 Redeploy Frontend
1. Go to **Deployments** tab
2. Click the latest deployment
3. Click **"Redeploy"** button
4. Wait for deployment to complete

---

## ✅ Testing Your Deployment

### Frontend Tests
- [ ] Visit your Vercel URL in browser
- [ ] Check console for errors
- [ ] No 404 errors displayed

### Backend Tests
- [ ] Test login functionality
- [ ] Try creating a new request
- [ ] Check if data is saved

### API Connection Tests
```bash
# Test login endpoint
curl -X POST https://blood-connect-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sengodai.org","password":"your_password"}'
```

---

## 🔧 Troubleshooting

### Frontend Shows 404
**Solution:**
1. Check Vercel environment variable `VITE_API_URL`
2. Make sure it points to correct Render backend URL
3. Redeploy frontend

### Backend Connection Errors
**Solution:**
1. Check Render logs: Dashboard → Service → Logs
2. Verify `MONGODB_URI` is correct
3. Verify MongoDB Atlas allows your IP
4. Check JWT_SECRET is set

### "Cannot GET /" Error
**Solution:**
1. Backend needs a root route
2. Add this to `backend/server.js`:
```javascript
app.get('/', (req, res) => {
  res.json({ message: 'Blood Connect API is running' });
});
```

### Slow Loading on Free Tier
**Solution:** Free tier services sleep after inactivity
- Render wakes up on first request (30s delay)
- Consider upgrading to paid tier for production

### CORS Errors in Console
**Solution:**
1. Update `CORS_ORIGIN` in Render environment variables
2. Add your Vercel URL: `https://your-frontend-url.vercel.app`
3. Redeploy backend

---

## 📊 Monitoring & Maintenance

### Check Backend Status
- Render Dashboard → your service → check green status
- Check **Logs** for errors
- Monitor CPU and memory usage

### Check Frontend Status
- Vercel Dashboard → your project → check deployment status
- Check **Deployments** for failed builds

### Monitor Database
- MongoDB Atlas → Clusters → check green status
- Monitor storage usage (free tier: 512MB limit)

---

## 🎯 Next Steps After Deployment

1. **Set Up Custom Domain**
   - Vercel: Settings → Domains
   - Add your custom domain

2. **Set Up SSL/TLS**
   - Both Vercel and Render provide free HTTPS
   - Already enabled by default

3. **Enable Monitoring**
   - Sentry (error tracking)
   - New Relic (performance monitoring)

4. **Set Up CI/CD**
   - GitHub Actions for automated deployments
   - Auto-deploy on push to main branch

5. **Production Database**
   - Backup MongoDB regularly
   - Consider moving from free tier eventually

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/

---

## 🎉 Congratulations!

Your Blood Connect application is now live! 🚀

**Your URLs:**
- **Frontend**: `https://blood-connect-frontend.vercel.app`
- **Backend**: `https://blood-connect-backend.onrender.com`
- **Database**: MongoDB Atlas (secure cloud)

Share your deployment link and enjoy your live application!
