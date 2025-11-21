#!/bin/bash

# Legal Case Advisor - Stop All Services Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Legal Case Advisor - Stop Services${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Get project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_DIR="$PROJECT_ROOT/logs"

# Function to stop service by PID file
stop_service() {
    local service_name=$1
    local pid_file="$PID_DIR/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${YELLOW}🛑${NC} Stopping $service_name (PID: $pid)..."
            kill $pid 2>/dev/null || kill -9 $pid 2>/dev/null
            rm "$pid_file"
            echo -e "${GREEN}✓${NC} $service_name stopped"
        else
            echo -e "${YELLOW}⚠${NC}  $service_name (PID: $pid) not running"
            rm "$pid_file"
        fi
    else
        echo -e "${YELLOW}⚠${NC}  No PID file for $service_name"
    fi
}

# Stop services in reverse order
stop_service "frontend"
stop_service "backend"
stop_service "ml_service"

# Also kill any remaining processes on those ports
echo ""
echo -e "${YELLOW}🔍${NC} Checking for remaining processes..."

# Kill processes on port 5176 (Frontend)
if lsof -ti:5176 > /dev/null 2>&1; then
    echo -e "${YELLOW}🛑${NC} Killing process on port 5176..."
    kill -9 $(lsof -ti:5176) 2>/dev/null || true
fi

# Kill processes on port 4000 (Backend)
if lsof -ti:4000 > /dev/null 2>&1; then
    echo -e "${YELLOW}🛑${NC} Killing process on port 4000..."
    kill -9 $(lsof -ti:4000) 2>/dev/null || true
fi

# Kill processes on port 5001 (ML Service)
if lsof -ti:5001 > /dev/null 2>&1; then
    echo -e "${YELLOW}🛑${NC} Killing process on port 5001..."
    kill -9 $(lsof -ti:5001) 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ All Services Stopped${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}To start services again, run:${NC}"
echo -e "  ./start.sh"
echo ""
