FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

FROM base AS deps

RUN apk add --no-cache git libc6-compat

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV CI=1
RUN pnpm install --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/ ./

COPY packages/database/ ./packages/database/
COPY packages/shared/ ./packages/shared/
COPY apps/web/ ./apps/web/
COPY tsconfig.json ./

RUN corepack enable && pnpm --filter @motorwa/web build

FROM base AS runner

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app/apps/web

COPY --from=builder /app/apps/web/next.config.js ./
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/packages/database/prisma ./prisma

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
