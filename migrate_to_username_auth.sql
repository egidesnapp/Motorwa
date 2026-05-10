-- Migration: Add username and passwordHash to User, make phone optional, remove OtpCode
-- This removes OtpCode table and updates User table

DROP TABLE IF EXISTS "OtpCode";

ALTER TABLE "User"
ADD COLUMN "username" TEXT,
ADD COLUMN "passwordHash" TEXT,
ALTER COLUMN "phone" DROP NOT NULL;

-- Create unique index on username
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- Make phone nullable in unique index
DROP INDEX IF EXISTS "User_phone_key";
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone") WHERE "phone" IS NOT NULL;
