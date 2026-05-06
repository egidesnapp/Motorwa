#!/bin/bash
set -e

echo "=== MotorWa Rollback ==="

ROLLBACK_TAG=${1:-"previous"}

if [ "$ROLLBACK_TAG" = "" ]; then
    echo "Usage: ./rollback.sh <image-tag>"
    echo "Example: ./rollback.sh v1.2.3"
    exit 1
fi

echo "Rolling back to tag: $ROLLBACK_TAG"

docker compose -f docker-compose.prod.yml down

# Override image tags for rollback
export API_IMAGE="motorwa-api:$ROLLBACK_TAG"
export WEB_IMAGE="motorwa-web:$ROLLBACK_TAG"

docker compose -f docker-compose.prod.yml up -d

echo "Rollback complete. Verifying..."
sleep 5

if curl -sf http://localhost:3001/health > /dev/null 2>&1; then
    echo "Rollback successful - API is healthy"
else
    echo "WARNING: API health check failed after rollback"
    docker compose -f docker-compose.prod.yml logs api --tail=50
fi
