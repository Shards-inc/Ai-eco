#!/bin/bash
set -e
echo "🚀 Initializing Enterprise AI Platform..."
mkdir -p data/raw data/processed models/checkpoints
pip install -r requirements.txt
cp .env.example .env
echo "✅ Setup complete. Run 'make test' to verify."