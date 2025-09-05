#!/bin/bash

# Backend Switcher Script for Vercel Clone
# Usage: ./scripts/switch-backend.sh [node|go]

set -e

BACKEND_TYPE=${1:-go}

if [ "$BACKEND_TYPE" = "node" ]; then
    echo "🟢 Starting Node.js backend..."
    echo "Frontend: http://localhost:5173"
    echo "Backend: http://localhost:3001"
    echo ""
    npm run dev
elif [ "$BACKEND_TYPE" = "go" ]; then
    echo "🚀 Starting Go backend..."
    echo "Frontend: http://localhost:5173"
    echo "Backend: http://localhost:3001"
    echo ""
    
    # Build Go server if needed
    if [ ! -f "go-server/bin/server" ]; then
        echo "Building Go server..."
        cd go-server && go build -o bin/server cmd/server/main.go && cd ..
    fi
    
    # Start both client and Go server
    concurrently "cd client && npm run dev" "cd go-server && ./bin/server" || {
        echo "Concurrently not found, starting manually..."
        echo "Starting React client in background..."
        cd client && npm run dev &
        CLIENT_PID=$!
        cd ..
        
        echo "Starting Go server..."
        cd go-server && ./bin/server &
        SERVER_PID=$!
        cd ..
        
        echo "Both servers started. Press Ctrl+C to stop."
        wait $CLIENT_PID $SERVER_PID
    }
else
    echo "Usage: $0 [node|go]"
    echo "  node - Start with Node.js/Express backend"
    echo "  go   - Start with Go/Gin backend (default)"
    exit 1
fi