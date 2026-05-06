#!/bin/bash
set -e

BACKUP_DIR="./deploy/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/motorwa_$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "=== MotorWa Database Backup ==="
echo "Creating backup: $BACKUP_FILE"

docker exec motorwa-postgres-prod pg_dump -U "${POSTGRES_USER:-motorwa}" "${POSTGRES_DB:-motorwa_prod}" | gzip > "$BACKUP_FILE"

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "Backup complete: $BACKUP_SIZE"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "motorwa_*.sql.gz" -mtime +7 -delete
echo "Cleaned up backups older than 7 days"

echo "Backups remaining:"
ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "  No backups found"
