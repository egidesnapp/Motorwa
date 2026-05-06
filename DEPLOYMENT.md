# MotorWa Production Deployment Guide

## Architecture

```
                  ┌─────────────┐
    Internet ────>│   Nginx     │
                  │  :80/:443   │
                  └──────┬──────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        ┌──────────┐         ┌──────────┐
        │   Web    │         │   API    │
        │  :3000   │         │  :3001   │
        │ Next.js  │         │Express.js│
        └──────────┘         └────┬─────┘
                                  │
                        ┌─────────┴─────────┐
                        ▼                   ▼
                  ┌──────────┐       ┌──────────┐
                  │ Postgres │       │  Redis   │
                  │  :5432   │       │  :6379   │
                  └──────────┘       └──────────┘
```

## Prerequisites

- Ubuntu 22.04+ / Debian 12+ server (4GB RAM, 2 CPU, 40GB disk minimum)
- Docker & Docker Compose installed
- Domain: `motorwa.rw` pointed to server IP
- SSL certificate (Let's Encrypt recommended)

## Quick Start

### 1. Clone & Configure

```bash
git clone https://github.com/your-org/motorwa.git /opt/motorwa
cd /opt/motorwa

# Copy production env
cp .env.production.example .env.production
# Edit .env.production with real values
nano .env.production
```

### 2. Deploy

```bash
# Using Makefile
make deploy

# Or manually
bash deploy/scripts/deploy.sh
```

### 3. Verify

```bash
# Health check
make health

# Check all services
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

## Mobile App (EAS Build)

### Setup

```bash
cd apps/mobile
eas login
eas build:configure
```

### Build Profiles

| Profile | Purpose | Distribution |
|---------|---------|--------------|
| `development` | Dev builds with Expo Dev Client | Internal |
| `preview` | Staging APK for testing | Internal |
| `production` | App Bundle for Play Store / IPA for App Store | Stores |

### Commands

```bash
# Development build (simulator)
eas build --profile development --platform ios

# Preview APK (Android)
eas build --profile preview --platform android

# Production (App Store + Play Store)
eas build --profile production --platform all

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

### Required Credentials

- `google-services.json` in `apps/mobile/` (Firebase Android)
- Apple App Store Connect account for iOS
- EAS Project ID in `app.json` (`extra.eas.projectId`)

## SSL Configuration

```bash
# Install certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d motorwa.rw -d www.motorwa.rw

# Copy certs to nginx
sudo cp /etc/letsencrypt/live/motorwa.rw/fullchain.pem deploy/nginx/ssl/
sudo cp /etc/letsencrypt/live/motorwa.rw/privkey.pem deploy/nginx/ssl/

# Uncomment HTTPS block in deploy/nginx/nginx.conf
# Then redeploy
make deploy
```

## Database Management

```bash
# Backup
make backup

# Migrate
docker compose -f docker-compose.prod.yml run --rm api npx prisma migrate deploy

# Studio (local access)
docker compose -f docker-compose.prod.yml run --rm api npx prisma studio

# Restore
gunzip < backup.sql.gz | docker exec -i motorwa-postgres-prod psql -U motorwa motorwa_prod
```

## Monitoring

### Health Endpoint

```bash
curl https://motorwa.rw/health
```

Returns:
```json
{
  "status": "ok",
  "uptime": 12345,
  "timestamp": "2026-05-07T00:00:00.000Z",
  "totalLatency": 12,
  "checks": {
    "database": { "status": "ok", "latency": 5 },
    "redis": { "status": "ok", "latency": 3 }
  }
}
```

### Log Access

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f api
```

## Rollback

```bash
# Rollback to previous image tag
make rollback tag=<git-sha>

# Example
make rollback tag=a1b2c3d
```

## CI/CD (GitHub Actions)

The `deploy-production.yml` workflow triggers on push to `main`:

1. Runs type checks
2. Builds Docker images
3. Pushes to Docker Hub
4. Deploys to server via SSH
5. Runs migrations
6. Verifies health

### Required Secrets

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `SERVER_HOST` | Production server IP |
| `SERVER_USER` | SSH username |
| `SERVER_SSH_KEY` | SSH private key |
