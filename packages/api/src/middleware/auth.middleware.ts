import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@motorwa/database";
import { verifyToken, getAccessSecret } from "../services/auth.service";

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = verifyToken(token, getAccessSecret());

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { isBanned: true, deletedAt: true },
    });

    if (!user || user.isBanned || user.deletedAt) {
      return res.status(403).json({ error: "Account not available" });
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Alias for backwards compatibility
export const requireAuth = authMiddleware;

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = verifyToken(token, getAccessSecret());
      if (decoded) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { isBanned: true, deletedAt: true },
        });
        if (user && !user.isBanned && !user.deletedAt) {
          req.user = decoded;
        }
      }
    } catch {
      // Ignore invalid tokens for optional auth
    }
  }

  next();
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};

// Alias for backwards compatibility
export const requireAdmin = adminMiddleware;

export const dealerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (req.user.role !== "DEALER" && req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Dealer access required" });
  }

  next();
};

// Alias for backwards compatibility
export const requireDealer = dealerMiddleware;
