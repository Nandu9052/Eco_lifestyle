#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "==============================================="
echo " Building Eco Lifestyle Agent for Render..."
echo "==============================================="

# 1. Build React Frontend
echo "-> Building React Frontend..."
cd frontend
npm install
npm run build
cd ..

# 2. Setup Python Backend
echo "-> Installing Backend Dependencies..."
cd backend
pip install --upgrade pip
pip install -r requirements.txt
python ingest.py
cd ..

echo "-> Build completed successfully!"
