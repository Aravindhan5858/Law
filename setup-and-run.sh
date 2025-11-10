#!/bin/bash

# Legal Case Advisor - Complete Setup and Run Script
# This script will setup and run both frontend and backend together

set -e  # Exit on error

echo "🚀 Legal Case Advisor - Full Stack Setup"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Step 1: Install root dependencies
echo "📦 Step 1: Installing root dependencies..."
npm install
echo "✅ Root dependencies installed"
echo ""

# Step 2: Install backend dependencies
echo "📦 Step 2: Installing backend dependencies..."
cd backend
if [ ! -f ".env" ]; then
    echo "⚙️  Creating backend .env file..."
    cp .env.example .env
fi
npm install
cd ..
echo "✅ Backend dependencies installed"
echo ""

# Step 3: Install frontend dependencies
echo "📦 Step 3: Installing frontend dependencies..."
cd frontend
if [ ! -f ".env" ]; then
    echo "⚙️  Frontend .env already exists"
fi
npm install
cd ..
echo "✅ Frontend dependencies installed"
echo ""

# Step 4: Setup database (if needed)
echo "🗄️  Step 4: Setting up database..."
cd backend
if [ ! -f "dev.db" ]; then
    echo "⚙️  Generating Prisma client..."
    npm run prisma:generate
    echo "⚙️  Running database migrations..."
    npm run prisma:migrate
    echo "⚙️  Seeding database..."
    npm run seed
else
    echo "ℹ️  Database already exists"
fi
cd ..
echo "✅ Database ready"
echo ""

echo "✨ Setup Complete!"
echo ""
echo "=========================================="
echo "🎉 Starting Frontend and Backend..."
echo "=========================================="
echo ""
echo "Frontend will run on: http://localhost:5173"
echo "Backend will run on:  http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Step 5: Run both servers concurrently
npm run dev
