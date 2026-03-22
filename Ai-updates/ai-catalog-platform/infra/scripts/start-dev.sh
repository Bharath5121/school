#!/bin/bash

set -e

echo "Starting AI Catalog Platform Development Environment..."

cd "$(dirname "$0")/../.."

echo "Building and starting Docker containers..."
docker compose up --build -d

echo "Waiting for databases to be ready..."
sleep 5

echo "Running database migrations..."
./infra/scripts/migrate-all.sh

echo "Development environment is ready!"
echo ""
echo "Services:"
echo "  Auth API:        http://localhost:4000/api"
echo "  Student API:     http://localhost:4001/api"
echo "  Parent API:      http://localhost:4002/api"
echo "  Admin API:       http://localhost:4003/api"
echo "  Student App:     http://localhost:3000"
echo "  Parent App:      http://localhost:3001"
echo "  Admin App:       http://localhost:3002"
echo "  AnythingLLM:     http://localhost:3100"
echo ""
echo "To view logs, run: docker compose logs -f"
