import { z } from 'zod';

export const phoneSchema = z.string().regex(/^\+250[0-9]{9}$/, 'Invalid Rwanda phone number');

export const sendOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6, 'OTP must be 6 digits'),
  fullName: z.string().min(2).max(100).optional(),
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
