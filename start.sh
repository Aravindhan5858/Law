#!/bin/bash

# Simple start script - Run both frontend and backend
# Make sure you've run setup first!

echo "🚀 Starting Legal Case Advisor..."
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

cd /home/aravind/codebase/Law
npm run dev
