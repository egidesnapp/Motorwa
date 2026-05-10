import { Request, Response } from 'express';
import { prisma } from '@motorwa/database';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken, revokeAllRefreshTokens } from '../utils/jwt';
import { registerSchema, loginSchema } from '@motorwa/shared';

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const { username, password, fullName, phone, email } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          ...(phone ? [{ phone }] : []),
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ success: false, error: 'Username already taken' });
      }
      if (phone && existingUser.phone === phone) {
        return res.status(409).json({ success: false, error: 'Phone number already registered' });
      }
      if (email && existingUser.email === email) {
        return res.status(409).json({ success: false, error: 'Email already registered' });
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        fullName,
        ...(phone ? { phone, isPhoneVerified: false } : {}),
        ...(email ? { email } : {}),
      },
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
      isVerified: user.isIdVerified,
    });

    const refreshToken = await generateRefreshToken(
      user.id,
      req.headers['user-agent'],
      req.ip
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          role: user.role,
          isPhoneVerified: user.isPhoneVerified,
          isIdVerified: user.isIdVerified,
        },
      },
    });
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, error: 'Username already taken' });
    }
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, error: 'Account suspended' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
      isVerified: user.isIdVerified,
    });

    const refreshToken = await generateRefreshToken(
      user.id,
      req.headers['user-agent'],
      req.ip
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          role: user.role,
          isPhoneVerified: user.isPhoneVerified,
          isIdVerified: user.isIdVerified,
        },
      },
    });
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, error: 'Refresh token required' });
    }

    const result = await verifyRefreshToken(refreshToken);

    if (!result) {
      res.clearCookie('refreshToken');
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: result.userId },
      select: { id: true, role: true, isIdVerified: true, isBanned: true },
    });

    if (!user || user.isBanned) {
      res.clearCookie('refreshToken');
      return res.status(401).json({ success: false, error: 'User not found or banned' });
    }

    await revokeRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
      isVerified: user.isIdVerified,
    });

    const newRefreshToken = await generateRefreshToken(
      user.id,
      req.headers['user-agent'],
      req.ip
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Token refresh failed' });
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    res.clearCookie('refreshToken');
    res.json({ success: true, data: { message: 'Logged out successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Logout failed' });
  }
};

export const logoutAllHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    await revokeAllRefreshTokens(userId);
    res.clearCookie('refreshToken');

    res.json({ success: true, data: { message: 'Logged out from all devices' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Logout failed' });
  }
};
