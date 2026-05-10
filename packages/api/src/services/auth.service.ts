import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one special character");

// Register validation schema
export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  fullName: z.string().min(2, "Full name required"),
  password: passwordSchema,
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
});

// Login validation schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

const getAccessSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET is not set');
  return secret;
};

const getRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not set');
  return secret;
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Generate tokens
export const generateTokens = (userId: string, username: string, role: string) => {
  const accessToken = jwt.sign(
    { id: userId, username, role },
    getAccessSecret(),
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: userId, username },
    getRefreshSecret(),
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Verify token
export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as any;
  } catch {
    return null;
  }
};

export { getAccessSecret, getRefreshSecret };
