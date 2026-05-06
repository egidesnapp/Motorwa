import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
});

export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many OTP requests. Please try again in an hour.' },
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, error: 'Too many requests. Please try again later.' },
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
});
