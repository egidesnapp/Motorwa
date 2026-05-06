#!/bin/bash

echo "=== MotorWa Health Check ==="

check_service() {
    local name=$1
    local url=$2
    local expected=${3:-200}

    local status
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

    if [ "$status" = "$expected" ]; then
        echo "[OK]   $name ($status)"
        return 0
    else
        echo "[FAIL] $name (HTTP $status, expected $expected)"
        return 1
    fi
}

check_docker() {
    local container=$1
    local status
    status=$(docker inspect -f '{{.State.Health.Status}}' "$container" 2>/dev/null || echo "not_found")

    if [ "$status" = "healthy" ]; then
        echo "[OK]   Docker: $container ($status)"
        return 0
    elif [ "$status" = "not_found" ]; then
        echo "[SKIP] Docker: $container (not running)"
        return 0
    else
        echo "[FAIL] Docker: $container ($status)"
        return 1
    fi
}

FAILURES=0

echo ""
echo "-- Container Health --"
check_docker "motorwa-postgres-prod" || FAILURES=$((FAILURES + 1))
check_docker "motorwa-redis-prod" || FAILURES=$((FAILURES + 1))

echo ""
echo "-- Service Health --"
check_service "API" "http://localhost:3001/health" || FAILURES=$((FAILURES + 1))
check_service "Web" "http://localhost:3000/" || FAILURES=$((FAILURES + 1))
check_service "Nginx" "http://localhost:80/" || FAILURES=$((FAILURES + 1))

echo ""
echo "-- Database Connection --"
if docker exec motorwa-postgres-prod pg_isready -U motorwa > /dev/null 2>&1; then
    echo "[OK]   PostgreSQL accepting connections"
else
    echo "[FAIL] PostgreSQL not accepting connections"
    FAILURES=$((FAILURES + 1))
fi

echo ""
echo "-- Redis Connection --"
if docker exec motorwa-redis-prod redis-cli -a "${REDIS_PASSWORD:-motorwa_redis}" ping > /dev/null 2>&1; then
    echo "[OK]   Redis responding to PING"
else
    echo "[FAIL] Redis not responding"
    FAILURES=$((FAILURES + 1))
fi

echo ""
echo "-- Disk Usage --"
docker system df 2>/dev/null | head -5

echo ""
if [ $FAILURES -eq 0 ]; then
    echo "=== All checks passed ==="
else
    echo "=== $FAILURES check(s) failed ==="
    exit 1
fi
