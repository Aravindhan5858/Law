#!/bin/bash

# Gemini API Key Setup Helper
# This script helps you get and configure your Gemini API key

echo "═══════════════════════════════════════════════════════════"
echo "🔑 GEMINI API KEY SETUP"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Follow these steps to get your FREE Gemini API key:"
echo ""
echo "STEP 1: Open this URL in your browser"
echo "👉 https://aistudio.google.com/app/apikey"
echo ""
echo "STEP 2: Sign in with your Google account"
echo ""
echo "STEP 3: Click 'Create API Key' button"
echo ""
echo "STEP 4: Copy the generated API key"
echo ""
echo "STEP 5: Paste it here when prompted"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Prompt for API key
read -p "Enter your Gemini API key (or press Ctrl+C to cancel): " API_KEY

if [ -z "$API_KEY" ]; then
    echo "❌ No API key entered. Exiting..."
    exit 1
fi

# Update the .env file
ENV_FILE="/home/aravind/codebase/Law/frontend/.env"

if [ -f "$ENV_FILE" ]; then
    # Replace the placeholder with actual key
    sed -i "s/VITE_GEMINI_API_KEY=.*/VITE_GEMINI_API_KEY=$API_KEY/" "$ENV_FILE"
    echo ""
    echo "✅ API key successfully added to .env file!"
    echo ""
    echo "Next steps:"
    echo "1. Restart your development server (Ctrl+C, then npm run dev)"
    echo "2. Refresh the browser page"
    echo "3. Try searching for a law (e.g., 'IPC 511')"
    echo ""
    echo "═══════════════════════════════════════════════════════════"
else
    echo "❌ Error: .env file not found at $ENV_FILE"
    exit 1
fi
