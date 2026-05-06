# MotorWa.rw — Rwanda's Trusted Car Marketplace

> Rwanda's premier professional, verified, and fully digital car marketplace.

## Quick Start

### Prerequisites

- Node.js 20+ LTS
- pnpm 9+
- Docker & Docker Compose

### Installation

1. **Clone and install dependencies:**

```bash
pnpm install
```

2. **Start local services (PostgreSQL + Redis):**

```bash
pnpm docker:up
```

3. **Set up environment variables:**

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Initialize the database:**

```bash
pnpm db:generate
pnpm db:migrate
```

5. **Start development servers:**

```bash
pnpm dev
```

- API: http://localhost:3001
- Web: http://localhost:3000

## Project Structure

```
motorwa-rw/
├── apps/
│   ├── web/                    # Next.js website (motorwa.rw)
│   └── admin/                  # Next.js admin panel (admin.motorwa.rw)
├── packages/
│   ├── api/                    # Express.js REST API
│   ├── database/               # Prisma schema + migrations
│   └── shared/                 # Shared types, constants, utils
├── docker-compose.yml          # Local dev: Postgres + Redis
└── package.json
```

## Development

### Available Commands

```bash
pnpm dev              # Start all dev servers
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm typecheck        # Type check all packages
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run database migrations
pnpm db:studio        # Open Prisma Studio
pnpm docker:up        # Start Docker services
pnpm docker:down      # Stop Docker services
```

### API Endpoints

All API endpoints are available at `http://localhost:3001/api/v1/`

- `POST /auth/send-otp` — Send OTP to phone
- `POST /auth/verify-otp` — Verify OTP and login/register
- `POST /auth/refresh` — Refresh access token
- `POST /auth/logout` — Logout
- `GET /users/me` — Get current user profile
- `GET /listings` — Search listings
- `POST /listings` — Create listing (auth required)
- `GET /listings/:id` — Get listing details
- `GET /listings/featured` — Get featured listings

## Tech Stack

### Backend
- Node.js 20 + Express.js
- TypeScript (strict mode)
- Prisma ORM + PostgreSQL
- Redis (caching + rate limiting)
- JWT authentication

### Frontend
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Zustand (state management)
- TanStack Query (data fetching)

## Environment Variables

See `.env.example` for all required environment variables.

## License

Private — All rights reserved.
