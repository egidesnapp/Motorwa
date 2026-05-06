.PHONY: dev build test deploy rollback health backup db-migrate db-seed logs clean

# Development
dev:
	pnpm dev

dev-api:
	cd packages/api && pnpm dev

dev-web:
	cd apps/web && pnpm dev

dev-mobile:
	cd apps/mobile && pnpm start

# Database
db-generate:
	pnpm db:generate

db-migrate:
	pnpm db:migrate

db-seed:
	pnpm db:seed

db-studio:
	pnpm db:studio

# Docker
docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

docker-clean:
	docker compose down -v
	docker system prune -f

# Production
deploy:
	bash deploy/scripts/deploy.sh

rollback:
	bash deploy/scripts/rollback.sh $(tag)

health:
	bash deploy/scripts/health-check.sh

backup:
	bash deploy/scripts/backup.sh

# Build
build:
	pnpm build

build-api:
	cd packages/api && pnpm build

build-web:
	cd apps/web && pnpm build

# Testing
test:
	pnpm test

test-api:
	cd packages/api && pnpm test

lint:
	pnpm lint

typecheck:
	pnpm typecheck

# Mobile (EAS)
eas-dev:
	cd apps/mobile && eas build --profile development --platform all

eas-preview:
	cd apps/mobile && eas build --profile preview --platform all

eas-prod:
	cd apps/mobile && eas build --profile production --platform all

eas-submit:
	cd apps/mobile && eas submit --platform all

# Utilities
install:
	pnpm install

clean:
	pnpm clean

setup:
	cp .env.example .env
	pnpm install
	pnpm db:generate
	docker compose up -d postgres redis
	sleep 5
	pnpm db:migrate
