#!/bin/bash

# Exist in case of error
set -e

# Build and run containers
docker-compose up -d

# Wait for postgres
sleep 5;

docker-compose run --rm backend alembic init migrations


docker-compose run --rm backend alembic revision  -m "create initial tables"
# Run migrations
docker-compose run --rm backend alembic upgrade head

# Create initial data
docker-compose run --rm backend python3 app/initial_data.py