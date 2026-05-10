import { z } from 'zod';

export const phoneSchema = z.string().regex(/^\+250[0-9]{9}$/, 'Invalid Rwanda phone number').optional();

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

export const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: phoneSchema.optional(),
  email: z.string().email('Invalid email').optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const createListingSchema = z.object({
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  fuelType: z.enum(['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC', 'OTHER']),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']),
  mileageKm: z.number().int().min(0).max(1000000),
  condition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_WORK']),
  priceRwf: z.number().int().min(100000).max(500000000),
  isNegotiable: z.boolean().default(false),
  description: z.string().min(20).max(2000),
  province: z.enum(['KIGALI', 'NORTHERN', 'SOUTHERN', 'EASTERN', 'WESTERN']),
  district: z.string().min(1).max(100),
  sector: z.string().max(100).optional(),
  importOrigin: z.enum(['JAPAN', 'UAE', 'SOUTH_AFRICA', 'EUROPE', 'LOCAL', 'OTHER']),
  hasServiceHistory: z.boolean().default(false),
  hasAccidentHistory: z.boolean().default(false),
  videoUrl: z.string().url().optional().or(z.literal('')),
});

export const updateListingSchema = createListingSchema.partial();

export const searchParamsSchema = z.object({
  q: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year_min: z.coerce.number().int().optional(),
  year_max: z.coerce.number().int().optional(),
  price_min: z.coerce.number().int().optional(),
  price_max: z.coerce.number().int().optional(),
  fuel_type: z.string().optional(),
  transmission: z.string().optional(),
  condition: z.string().optional(),
  province: z.string().optional(),
  seller_type: z.string().optional(),
  import_origin: z.string().optional(),
  sort: z.enum(['newest', 'price_low', 'price_high', 'most_viewed']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  photoUrls: z.array(z.string().url()).optional(),
});

export const createReviewSchema = z.object({
  reviewedUserId: z.string().uuid(),
  listingId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  email: z.string().email('Invalid email').optional(),
  province: z.enum(['KIGALI', 'NORTHERN', 'SOUTHERN', 'EASTERN', 'WESTERN']).optional(),
  district: z.string().min(1).max(100).optional(),
  language: z.enum(['en', 'fr', 'rw']).optional(),
});
