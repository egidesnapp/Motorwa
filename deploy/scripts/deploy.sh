#!/bin/bash
set -e

echo "=== MotorWa Production Deployment ==="

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "ERROR: .env.production not found!"
    echo "Copy .env.production.example to .env.production and fill in values:"
    echo "  cp .env.production.example .env.production"
    exit 1
fi

# Load env vars
set -a
source .env.production
set +a

echo "1/6 Pulling latest images..."
docker compose -f docker-compose.prod.yml pull

echo "2/6 Building services..."
docker compose -f docker-compose.prod.yml build --no-cache

echo "3/6 Stopping old containers..."
docker compose -f docker-compose.prod.yml down --remove-orphans

echo "4/6 Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo "5/6 Running database migrations..."
docker compose -f docker-compose.prod.yml exec -T api npx prisma migrate deploy

echo "6/6 Health checks..."
MAX_RETRIES=30
RETRY_COUNT=0

echo "Waiting for API to be ready..."
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -sf http://localhost:3001/health > /dev/null 2>&1; then
        echo "API is healthy!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Retry $RETRY_COUNT/$MAX_RETRIES..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "WARNING: API health check timed out. Check logs with: docker compose -f docker-compose.prod.yml logs api"
    exit 1
fi

echo ""
echo "=== Deployment Complete ==="
echo "Web:  https://motorwa.rw"
echo "API:  https://motorwa.rw/api"
echo "Logs: docker compose -f docker-compose.prod.yml logs -f"
