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
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:4000/api"
echo ""
echo "To view logs, run: docker compose logs -f"
