import { Request, Response } from 'express';
import { prisma } from '@motorwa/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken, revokeAllRefreshTokens } from '../utils/jwt';
import { sendOtp, verifyOtp } from '../utils/otp';
import { sendOtpSchema, verifyOtpSchema } from '@motorwa/shared';

export const sendOtpHandler = async (req: Request, res: Response) => {
  try {
    const { phone } = sendOtpSchema.parse(req.body);

    const success = await sendOtp(phone);

    if (!success) {
      return res.status(500).json({ success: false, error: 'Failed to send OTP' });
    }

    res.json({ success: true, data: { message: 'OTP sent successfully' } });
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ success: false, error: 'Failed to send OTP' });
  }
};

export const verifyOtpHandler = async (req: Request, res: Response) => {
  try {
    const { phone, code, fullName } = verifyOtpSchema.parse(req.body);

    const isValid = await verifyOtp(phone, code);

    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      if (!fullName) {
        return res.status(400).json({ success: false, error: 'Full name required for new accounts' });
      }

      user = await prisma.user.create({
        data: {
          phone,
          fullName,
          isPhoneVerified: true,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { isPhoneVerified: true, lastLoginAt: new Date() },
      });
    }

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
          phone: user.phone,
          fullName: user.fullName,
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
    res.status(500).json({ success: false, error: 'Failed to verify OTP' });
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

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
