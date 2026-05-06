FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

FROM base AS deps

RUN apk add --no-cache git libc6-compat

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY packages/api/package.json ./packages/api/

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV CI=1
RUN pnpm install --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/ ./

COPY packages/database/ ./packages/database/
COPY packages/shared/ ./packages/shared/
COPY packages/api/ ./packages/api/
COPY tsconfig.json ./

RUN corepack enable && pnpm --filter @motorwa/api build

FROM base AS runner

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api

WORKDIR /app/packages/api

COPY --from=builder /app/packages/database/prisma ./prisma
COPY --from=builder /app/packages/database/dist ./database/dist
COPY --from=builder /app/packages/database/node_modules ./database/node_modules
COPY --from=builder /app/packages/shared/dist ./shared/dist
COPY --from=builder /app/packages/shared/node_modules ./shared/node_modules
COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY packages/api/package.json ./

RUN chown -R api:nodejs /app

USER api

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/app.js"]
