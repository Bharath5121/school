#!/bin/bash

set -e

DB_USER="${POSTGRES_USER:-postgres}"
DB_PASS="${POSTGRES_PASSWORD:-postgres}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5433}"
DB_NAME="ai_catalog_db"

echo "Running Database Migrations..."

cd "$(dirname "$0")/../.."

DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo "Migrating auth service schema..."
cd backend/auth
DATABASE_URL="$DATABASE_URL" npx prisma db push
cd ../..

echo "Migrating student service schema..."
cd backend/apps/student
DATABASE_URL="$DATABASE_URL" npx prisma db push
cd ../../..

echo "Migrating parent service schema..."
cd backend/apps/parent
DATABASE_URL="$DATABASE_URL" npx prisma db push
cd ../../..

echo "Migrating admin service schema..."
cd backend/apps/admin
DATABASE_URL="$DATABASE_URL" npx prisma db push
cd ../../..

echo "Seeding Database..."
if command -v docker-compose &> /dev/null; then
  COMPOSE_CMD="docker-compose"
else
  COMPOSE_CMD="docker compose"
fi

POSTGRES_CONTAINER=$($COMPOSE_CMD ps -q postgres)
if [ -n "$POSTGRES_CONTAINER" ]; then
  for seed_file in backend/database/seeds/*.sql; do
    if [ -f "$seed_file" ]; then
      echo "Applying seed: $seed_file"
      docker exec -i "$POSTGRES_CONTAINER" psql -U "${DB_USER}" -d "${DB_NAME}" < "$seed_file"
    fi
  done
fi

echo "All database migrations and seeds applied successfully!"
