#!/bin/bash

# Blood Connect - Quick Deployment Setup Script
# This script helps you prepare your code for deployment

echo "======================================"
echo "Blood Connect Deployment Setup"
echo "======================================"
echo ""

# Create frontend repo
echo "Step 1: Setting up Frontend Repository..."
cd frontend

# Check if git is initialized
if [ ! -d ".git" ]; then
    git init
fi

git add .
git commit -m "Frontend: Initial commit for Vercel deployment" || echo "Frontend already committed"

echo "✓ Frontend prepared"
echo ""
echo "Next steps for Frontend:"
echo "1. Create a new GitHub repo: https://github.com/new?name=blood-connect-frontend"
echo "2. Run these commands:"
echo "   cd frontend"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/blood-connect-frontend.git"
echo "   git push -u origin main"
echo ""

# Create backend repo
echo "Step 2: Setting up Backend Repository..."
cd ../backend

# Check if git is initialized
if [ ! -d ".git" ]; then
    git init
fi

git add .
git commit -m "Backend: Initial commit for Render deployment" || echo "Backend already committed"

echo "✓ Backend prepared"
echo ""
echo "Next steps for Backend:"
echo "1. Create a new GitHub repo: https://github.com/new?name=blood-connect-backend"
echo "2. Run these commands:"
echo "   cd backend"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/blood-connect-backend.git"
echo "   git push -u origin main"
echo ""

echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next: Follow the deployment guide at DEPLOYMENT_GUIDE.md"
