import { Router, Request, Response } from 'express';
import { prisma } from '@motorwa/database';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const checks: Record<string, { status: string; latency?: number }> = {};
  let overallStatus = 'ok';
  const startTime = Date.now();

  // Check database
  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: 'ok', latency: Date.now() - dbStart };
  } catch (err: any) {
    checks.database = { status: 'error' };
    overallStatus = 'degraded';
  }

  // Check Redis
  const redisStart = Date.now();
  try {
    const Redis = require('ioredis');
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
    });
    await redis.ping();
    checks.redis = { status: 'ok', latency: Date.now() - redisStart };
    await redis.quit();
  } catch {
    checks.redis = { status: 'error' };
    overallStatus = 'degraded';
  }

  res.json({
    status: overallStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    totalLatency: Date.now() - startTime,
    checks,
  });
});

export default router;
