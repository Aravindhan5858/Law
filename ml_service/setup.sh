#!/bin/bash

# Setup script for ML Service

echo "🔧 Setting up Legal ML Service..."

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# Download spaCy English model
python -m spacy download en_core_web_sm

echo "✅ Setup complete!"
echo "Run: python app.py"
