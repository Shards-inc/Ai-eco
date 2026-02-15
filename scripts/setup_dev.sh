#!/bin/bash
# Local dev setup script
echo "🔧 Setting up local environment..."
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
docker-compose up -d vector-db redis
echo "✅ Done. Start developing."
