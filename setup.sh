#!/bin/bash

echo "🚀 Contractor Leads SaaS - Local Setup"
echo "======================================"
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python 3 found"

# Navigate to backend directory
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  No .env file found!"
    echo "📋 Copy .env.example to .env and fill in your credentials:"
    echo "   cp .env.example .env"
    echo "   nano .env"
    echo ""
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🏃 To run the server:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo "🌐 Server will run on http://localhost:5000"
echo ""
echo "🧪 Test webhook locally with ngrok:"
echo "   1. Install ngrok: https://ngrok.com/download"
echo "   2. Run: ngrok http 5000"
echo "   3. Copy ngrok URL to Stripe webhook settings"
echo ""
