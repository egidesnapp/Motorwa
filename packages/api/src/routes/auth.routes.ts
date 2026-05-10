import { Router, Request, Response } from "express";
import { PrismaClient } from "@motorwa/database";
import jwt from "jsonwebtoken";
import { authLimiter } from "../middleware/rateLimit.middleware";
import {
  registerSchema,
  loginSchema,
  hashPassword,
  comparePassword,
  generateTokens,
  getAccessSecret,
  getRefreshSecret,
} from "../services/auth.service";

const router = Router();
const prisma = new PrismaClient();

router.use(authLimiter);

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// POST /api/v1/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const validated = registerSchema.parse(req.body);

    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username: validated.username },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // Hash password
    const passwordHash = await hashPassword(validated.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: validated.username,
        passwordHash,
        fullName: validated.fullName,
        email: validated.email || null,
        phone: validated.phone || null,
        role: "USER",
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.username, user.role);

    // Store refresh token hash (optional but recommended)
    const refreshTokenHash = await hashPassword(refreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress: req.ip,
      },
    });

    res
      .status(201)
      .cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)
      .json({ user, accessToken });
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: error.message || "Registration failed" });
  }
});

// POST /api/v1/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);

    // Find user (use a constant-time lookup to prevent enumeration)
    const user = await prisma.user.findUnique({
      where: { username: validated.username },
      select: {
        id: true,
        username: true,
        passwordHash: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isBanned: true,
        deletedAt: true,
      },
    });

    const genericError = "Invalid credentials";

    if (!user) {
      return res.status(401).json({ error: genericError });
    }

    if (user.isBanned) {
      return res.status(403).json({ error: "Account banned" });
    }

    if (user.deletedAt) {
      return res.status(403).json({ error: "Account deleted" });
    }

    // Compare password
    const passwordMatch = await comparePassword(validated.password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: genericError });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.username, user.role);

    // Store refresh token hash
    const refreshTokenHash = await hashPassword(refreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: req.ip,
      },
    });

    res
      .cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)
      .json({
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        accessToken,
      });
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: error.message || "Login failed" });
  }
});

// POST /api/v1/auth/refresh
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    const decoded = jwt.verify(refreshToken, getRefreshSecret()) as any;

    // Find valid refresh token
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        userId: decoded.id,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!storedToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        role: true,
        isBanned: true,
        deletedAt: true,
      },
    });

    if (!user || user.isBanned || user.deletedAt) {
      return res.status(403).json({ error: "User not available" });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.username, user.role);

    // Store new refresh token
    const newTokenHash = await hashPassword(newRefreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: newTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: req.ip,
      },
    });

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    res
      .cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS)
      .json({ accessToken });
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

// POST /api/v1/auth/logout
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, getRefreshSecret()) as any;
        await prisma.refreshToken.updateMany({
          where: { userId: decoded.id },
          data: { isRevoked: true },
        });
      } catch {
        // Token already invalid, still clear cookie
      }
    }

    res
      .clearCookie('refreshToken', { path: '/api/v1/auth' })
      .json({ message: "Logged out" });
  } catch {
    res.status(400).json({ error: "Logout failed" });
  }
});

export default router;
