import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import { prisma } from '@motorwa/database';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-secret-change-in-production';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production';
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '30d';

export interface JwtPayload {
  userId: string;
  role: string;
  isVerified: boolean;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
};

export const generateRefreshToken = async (
  userId: string,
  deviceInfo?: string,
  ipAddress?: string
): Promise<string> => {
  const token = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
  const tokenHash = createHash('sha256').update(token).digest('hex');

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      deviceInfo,
      ipAddress,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await enforceRefreshTokenLimit(userId);

  return token;
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as { userId: string };
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        userId: decoded.userId,
        tokenHash,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!refreshToken) return null;

    return { userId: decoded.userId, refreshToken };
  } catch {
    return null;
  }
};

export const revokeRefreshToken = async (token: string): Promise<void> => {
  const tokenHash = createHash('sha256').update(token).digest('hex');
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { isRevoked: true },
  });
};

export const revokeAllRefreshTokens = async (userId: string): Promise<void> => {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { isRevoked: true },
  });
};

const enforceRefreshTokenLimit = async (userId: string): Promise<void> => {
  const tokens = await prisma.refreshToken.findMany({
    where: { userId, isRevoked: false },
    orderBy: { createdAt: 'asc' },
  });

  if (tokens.length > 3) {
    const tokensToDelete = tokens.slice(0, tokens.length - 3);
    await prisma.refreshToken.deleteMany({
      where: { id: { in: tokensToDelete.map(t => t.id) } },
    });
  }
};
