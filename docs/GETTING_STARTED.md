# MotorWa.rw — Getting Started Guide

This guide walks you through running the complete MotorWa.rw car marketplace locally using Docker.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Quick Start (One Command)](#2-quick-start-one-command)
3. [Step-by-Step Setup](#3-step-by-step-setup)
4. [Database Management with PGAdmin](#4-database-management-with-pgadmin)
5. [Running Services Individually](#5-running-services-individually)
6. [Environment Variables](#6-environment-variables)
7. [Useful Commands Reference](#7-useful-commands-reference)
8. [Troubleshooting](#8-troubleshooting)
9. [Project Structure](#9-project-structure)

---

## 1. Prerequisites

Install these tools before proceeding:

| Tool | Version | Download |
|------|---------|----------|
| **Docker Desktop** | 24+ | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) |
| **Node.js** | 20 LTS | [nodejs.org](https://nodejs.org) |
| **pnpm** | 9+ | `corepack enable` (comes with Node 20) |
| **Git** | 2.40+ | [git-scm.com](https://git-scm.com) |
| **PGAdmin 4** (optional) | 8+ | [pgadmin.org/download](https://www.pgadmin.org/download) |

### Verify Installation

```bash
docker --version       # Docker version 24.x.x
docker compose version # Docker Compose version v2.x.x
node --version         # v20.x.x
pnpm --version         # 9.x.x
git --version          # git version 2.4x.x
```

> **Windows users:** Ensure Docker Desktop is running and using WSL 2 backend. Enable "Expose daemon on tcp://localhost:2375" if you get connection errors.

---

## 2. Quick Start (One Command)

If you have all prerequisites installed, the fastest way to get running is:

```bash
# Clone the repository
git clone https://github.com/egidesnapp/Motorwa.git
cd Motorwa

# Copy environment files
cp .env.example .env
cp apps/mobile/.env.example apps/mobile/.env
cp apps/web/.env.example apps/web/.env

# Start Docker services (PostgreSQL + Redis)
docker compose up -d

# Install dependencies and generate Prisma client
pnpm install
pnpm db:generate

# Wait 10 seconds for Postgres to fully start, then run migrations
pnpm db:migrate

# Start all development servers
pnpm dev
```

Your services will be available at:

| Service | URL |
|---------|-----|
| **Web App (Next.js)** | [http://localhost:3000](http://localhost:3000) |
| **API (Express.js)** | [http://localhost:3001](http://localhost:3001) |
| **Admin Panel** | [http://localhost:3002](http://localhost:3002) |
| **PGAdmin** | [http://localhost:5050](http://localhost:5050) |
| **PostgreSQL** | `localhost:5432` |
| **Redis** | `localhost:6379` |
| **API Health Check** | [http://localhost:3001/health](http://localhost:3001/health) |

---

## 3. Step-by-Step Setup

### 3.1 Clone & Navigate

```bash
git clone https://github.com/egidesnapp/Motorwa.git
cd Motorwa
```

### 3.2 Configure Environment Variables

Create the root `.env` file:

```bash
cp .env.example .env
```

Open `.env` in your editor. The defaults work for local development — you only need to change values if you want to test integrations (SMS, payments, etc.):

```env
# These are the defaults — they work out of the box:
DATABASE_URL="postgresql://motorwa:motorwa_password@localhost:5432/motorwa_dev?schema=public&connection_limit=10"
REDIS_URL="redis://localhost:6379"
JWT_ACCESS_SECRET="your-access-secret-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
ADMIN_URL="http://localhost:3002"
```

Create web app `.env`:

```bash
cp apps/web/.env.local.example apps/web/.env.local 2>/dev/null || echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > apps/web/.env.local
```

Create mobile app `.env`:

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

### 3.3 Start Docker Services

```bash
docker compose up -d
```

This starts two containers:
- **motorwa-postgres** — PostgreSQL 15 database
- **motorwa-redis** — Redis 7 cache

Verify they're running:

```bash
docker compose ps
```

Expected output:

```
NAME                STATUS         PORTS
motorwa-postgres    Up (healthy)   0.0.0.0:5432->5432/tcp
motorwa-redis       Up (healthy)   0.0.0.0:6379->6379/tcp
```

### 3.4 Install Dependencies & Generate Prisma Client

```bash
pnpm install
pnpm db:generate
```

### 3.5 Run Database Migrations

```bash
pnpm db:migrate
```

This creates all tables in the database (users, listings, payments, messages, etc.).

Verify tables were created:

```bash
pnpm db:studio
```

This opens Prisma Studio at [http://localhost:5555](http://localhost:5555) where you can browse your database visually.

### 3.6 Seed the Database (Optional)

```bash
pnpm db:seed
```

This populates the database with sample data (test users, listings, dealers).

### 3.7 Start Development Servers

```bash
pnpm dev
```

This starts all three apps simultaneously using Turborepo:

```
@motorwa/api:dev:    API server running on port 3001
@motorwa/web:dev:    ▲ Next.js 14.2.5  |  http://localhost:3000
@motorwa/admin:dev:  ▲ Next.js 14.2.5  |  http://localhost:3002
```

> **Tip:** To run only one service at a time, see [Section 5](#5-running-services-individually).

### 3.8 Verify Everything Works

Open your browser to [http://localhost:3001/health](http://localhost:3001/health):

```json
{
  "status": "ok",
  "timestamp": "2026-05-07T00:00:00.000Z"
}
```

Then visit [http://localhost:3000](http://localhost:3000) to see the MotorWa homepage.

---

## 4. Database Management with PGAdmin

### 4.1 Access PGAdmin (Docker — Recommended)

PGAdmin is included in `docker-compose.yml` and starts automatically:

```bash
docker compose up -d
```

Open [http://localhost:5050](http://localhost:5050) in your browser.

**Login credentials:**
- **Email:** `admin@motorwa.rw`
- **Password:** `admin`

### 4.2 Connect to the MotorWa Database

1. In PGAdmin, right-click **"Servers"** → **Register** → **Server**

2. **General tab:**
   - **Name:** `MotorWa Dev`

3. **Connection tab:**
   - **Host name/address:** `motorwa-postgres` (Docker network name) or `localhost` (if accessing from outside Docker)
   - **Port:** `5432`
   - **Maintenance database:** `motorwa_dev`
   - **Username:** `motorwa`
   - **Password:** `motorwa_password`
   - Check **"Save password"**

4. Click **Save**

5. Expand **Servers → MotorWa Dev → Databases → motorwa_dev → Schemas → public → Tables**

You should see all 20+ tables:

```
User
Listing
ListingPhoto
Conversation
Message
Payment
Review
DealerProfile
Notification
SavedListing
SavedSearch
PhoneReveal
Report
Inspection
Subscription
Transaction
AdminLog
```

### 4.3 Install PGAdmin Locally (Alternative)

If you prefer a desktop install instead of the Docker service:

Download from: [https://www.pgadmin.org/download/](https://www.pgadmin.org/download/)

- **Windows:** Run the `.exe` installer
- **macOS:** Download the `.dmg`
- **Linux:** Use your package manager (`sudo apt install pgadmin4`)

### 4.4 Common PGAdmin Tasks

#### View all users

Right-click the `User` table → **View/Edit Data** → **All Rows**

#### Run a query

Click the **Query Tool** icon (⚡) and run:

```sql
-- List all active listings
SELECT id, title, price, status, "createdAt"
FROM "Listing"
WHERE status = 'active'
ORDER BY "createdAt" DESC
LIMIT 10;

-- Count listings by status
SELECT status, COUNT(*) as count
FROM "Listing"
GROUP BY status;

-- Find users with phone numbers
SELECT id, phone, role, "createdAt"
FROM "User"
WHERE phone IS NOT NULL;
```

#### View a listing's photos

```sql
SELECT lp.url, lp.alt, lp.order, l.title
FROM "ListingPhoto" lp
JOIN "Listing" l ON lp."listingId" = l.id
WHERE l.id = 'YOUR_LISTING_ID'
ORDER BY lp."order";
```

#### Reset the database (WARNING: deletes all data)

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

Then run `pnpm db:migrate` again to recreate all tables.

### 4.5 PGAdmin Server Configuration (Production)

In production (`docker-compose.prod.yml`), PGAdmin is bound to `127.0.0.1:5050` for security — it's only accessible from the server itself. To access it remotely:

**Option A: SSH tunnel (recommended)**
```bash
ssh -L 5050:localhost:5050 user@your-server
```
Then open [http://localhost:5050](http://localhost:5050) locally.

**Option B: Nginx reverse proxy with authentication**

Add to `deploy/nginx/nginx.conf`:
```nginx
location /pgadmin/ {
    auth_basic "PGAdmin";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://pgadmin:80/;
    proxy_set_header Host $host;
}
```

Change PGAdmin credentials in `.env.production`:
```env
PGADMIN_EMAIL=dba@motorwa.rw
PGADMIN_PASSWORD=<strong-password>
```

---

## 5. Running Services Individually

### 5.1 API Server Only

```bash
cd packages/api
pnpm dev
```

Runs at [http://localhost:3001](http://localhost:3001)

### 5.2 Web App Only

```bash
cd apps/web
pnpm dev
```

Runs at [http://localhost:3000](http://localhost:3000)

### 5.3 Admin Panel Only

```bash
cd apps/admin
pnpm dev
```

Runs at [http://localhost:3002](http://localhost:3002)

### 5.4 Mobile App Only

```bash
cd apps/mobile
pnpm start
```

This opens Expo Dev Tools. Press:
- `a` — Open on Android emulator
- `i` — Open on iOS simulator
- `w` — Open in web browser

### 5.5 All Services with Turborepo

From the project root:

```bash
pnpm dev
```

Runs web, api, and admin simultaneously with shared logs.

---

## 6. Environment Variables

### 6.1 Root `.env` (API)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `postgresql://...` | PostgreSQL connection string |
| `REDIS_URL` | Yes | `redis://localhost:6379` | Redis connection string |
| `JWT_ACCESS_SECRET` | Yes | - | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Yes | - | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRY` | No | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRY` | No | `30d` | Refresh token lifetime |
| `PORT` | No | `3001` | API server port |
| `NODE_ENV` | No | `development` | `development`, `production`, or `test` |
| `FRONTEND_URL` | No | `http://localhost:3000` | Web app URL (for CORS) |
| `ADMIN_URL` | No | `http://localhost:3002` | Admin panel URL (for CORS) |

#### Integration Variables (optional — skip for local dev)

| Variable | Description |
|----------|-------------|
| `AT_API_KEY` | Africa's Talking API key for SMS |
| `AT_USERNAME` | Africa's Talking username |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | Public URL for R2 assets |
| `MTN_BASE_URL` | MTN MoMo API base URL |
| `MTN_SUBSCRIPTION_KEY` | MTN MoMo subscription key |
| `AIRTEL_BASE_URL` | Airtel Money API base URL |
| `AIRTEL_CLIENT_ID` | Airtel Money client ID |
| `SENDGRID_API_KEY` | SendGrid email API key |

### 6.2 Web App `apps/web/.env.local`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:3001` | API base URL |

### 6.3 Mobile App `apps/mobile/.env`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EXPO_PUBLIC_API_URL` | Yes | `http://localhost:3001` | API base URL |
| `EXPO_PUBLIC_PROJECT_ID` | No | - | Expo project ID (for OTA updates) |

---

## 7. Useful Commands Reference

### Docker

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# View logs for a specific service
docker compose logs -f postgres
docker compose logs -f redis

# Restart a service
docker compose restart postgres

# Rebuild containers (after changing docker-compose.yml)
docker compose up -d --build

# Stop and delete all data (WARNING: destroys database)
docker compose down -v

# Check container status
docker compose ps
```

### Makefile (shortcut commands)

```bash
make setup       # Full initial setup: install, generate, start Docker, migrate
make dev         # Start all dev servers
make dev-api     # Start API only
make dev-web     # Start web only
make dev-mobile  # Start mobile only
make db-generate # Generate Prisma client
make db-migrate  # Run database migrations
make db-studio   # Open Prisma Studio
make docker-up   # Start Docker containers
make docker-down # Stop Docker containers
make health      # Run health checks (production)
make backup      # Database backup (production)
make clean       # Remove node_modules and builds
```

### pnpm

```bash
pnpm install          # Install all dependencies
pnpm dev              # Start all dev servers
pnpm build            # Build all apps
pnpm typecheck        # Type-check all packages
pnpm lint             # Lint all packages
pnpm test             # Run all tests
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run database migrations
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed database with sample data
pnpm db:reset         # Reset database (drop + migrate)
pnpm clean            # Remove all build outputs and node_modules
```

### Git

```bash
git status            # Check working tree status
git log --oneline -10 # Last 10 commits
git pull origin main  # Pull latest changes
```

---

## 8. Troubleshooting

### Docker containers won't start

```bash
# Check if ports are already in use
netstat -ano | findstr :5432
netstat -ano | findstr :6379

# Kill processes using those ports, or change ports in docker-compose.yml
```

### "Connection refused" to PostgreSQL

```bash
# Wait for Postgres to be healthy
docker compose ps

# Check health status — it should say "healthy"
# If not, wait 10-15 seconds and try again

# View Postgres logs for errors
docker compose logs postgres
```

### Prisma migration fails

```bash
# Reset the database
pnpm db:reset

# Or manually drop and recreate
docker compose down -v
docker compose up -d
sleep 10
pnpm db:generate
pnpm db:migrate
```

### Port conflicts (EADDRINUSE)

| Port | Service | Fix |
|------|---------|-----|
| `3000` | Next.js web | Change in `apps/web/next.config.js` or kill existing process |
| `3001` | Express API | Change `PORT` in `.env` |
| `3002` | Next.js admin | Change in `apps/admin/next.config.js` |
| `5432` | PostgreSQL | Change in `docker-compose.yml` ports mapping |
| `6379` | Redis | Change in `docker-compose.yml` ports mapping |
| `5555` | Prisma Studio | Change with `--port` flag |
| `8081` | Metro bundler | Run `npx react-native start --port 8082` |

### Web app can't connect to API

1. Verify API is running at [http://localhost:3001/health](http://localhost:3001/health)
2. Check `apps/web/.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Check CORS settings in `packages/api/src/app.ts` — it should include `http://localhost:3000`

### Mobile app can't connect to API on emulator

For **Android emulator**, use `10.0.2.2` instead of `localhost`:

```env
# apps/mobile/.env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3001
```

For **iOS simulator**, `localhost` works fine.

### "pnpm not found" or "command not recognized"

```bash
# Enable corepack (comes with Node 20)
corepack enable
corepack prepare pnpm@latest --activate

# Or install globally
npm install -g pnpm
```

### Docker Desktop on Windows — WSL 2 issues

1. Open Docker Desktop Settings
2. Go to **Resources → WSL Integration**
3. Enable integration with your WSL distro
4. Click **Apply & restart**

### Database is slow or unresponsive

```bash
# Check Postgres resource usage
docker stats motorwa-postgres

# Restart Postgres
docker compose restart postgres

# Check for long-running queries via PGAdmin
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;
```

---

## 9. Project Structure

```
MotorWa/
├── apps/
│   ├── web/                  # Next.js 14 web application (:3000)
│   │   ├── app/              # App Router pages
│   │   ├── components/       # Shared UI components
│   │   └── lib/              # API client, utilities
│   ├── mobile/               # Expo React Native mobile app
│   │   ├── app/              # Expo Router screens
│   │   ├── components/       # Mobile UI components
│   │   └── lib/              # API client, auth, socket, push
│   └── admin/                # Next.js admin panel (:3002)
│       ├── app/              # Admin pages
│       └── components/       # Admin layout
│
├── packages/
│   ├── api/                  # Express.js REST API (:3001)
│   │   ├── src/
│   │   │   ├── controllers/  # Request handlers
│   │   │   ├── routes/       # Route definitions
│   │   │   ├── middleware/   # Auth, rate limit, validation
│   │   │   ├── services/     # MTN, Airtel, image processing
│   │   │   └── utils/        # JWT, OTP, SMS, storage
│   │   └── Dockerfile
│   ├── database/             # Prisma ORM package
│   │   ├── prisma/
│   │   │   └── schema.prisma # Database schema (20+ models)
│   │   └── src/
│   └── shared/               # Shared types, constants, validation
│       └── src/
│
├── deploy/                   # Production deployment files
│   ├── nginx/                # Nginx reverse proxy config
│   └── scripts/              # Deploy, rollback, backup, health
│
├── docker-compose.yml        # Development Docker setup
├── docker-compose.prod.yml   # Production Docker setup
├── .env.example              # Environment template
├── package.json              # Root workspace config
├── pnpm-workspace.yaml       # pnpm workspace definition
├── turbo.json                # Turborepo pipeline config
└── Makefile                  # Shortcut commands

Ports:
  :3000  → Web App (Next.js)
  :3001  → API (Express.js)
  :3002  → Admin Panel (Next.js)
  :5432  → PostgreSQL
  :6379  → Redis
  :5555  → Prisma Studio (when running)
```

---

## 10. Next Steps After Local Setup

1. **Explore the web app** — Visit [http://localhost:3000](http://localhost:3000) and browse the marketplace
2. **Create a test account** — Use the login page with any phone number (OTP is logged to console in development)
3. **Post a listing** — Navigate to `/post` to create a test car listing
4. **Access the admin panel** — Visit [http://localhost:3002](http://localhost:3002) to manage listings and users
5. **Try the mobile app** — Run `cd apps/mobile && pnpm start` to launch Expo Dev Tools
6. **Browse the database** — Open Prisma Studio (`pnpm db:studio`) or PGAdmin to see your data

For production deployment, see `DEPLOYMENT.md` in the project root.
