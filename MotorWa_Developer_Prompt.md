# MotorWa.rw — Complete Developer Build Prompt
## Rwanda's Premier Car Marketplace — Full Stack Web & Mobile Application

> **How to use this document:** This is your single source of truth. Read it fully before writing a single line of code. Every section is intentional. Every requirement listed here is non-negotiable unless explicitly marked as Phase 2+. Build in the order described. Ask questions before building — not after.

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Brand & Design System](#2-brand--design-system)
3. [Tech Stack — Required](#3-tech-stack--required)
4. [Project Structure](#4-project-structure)
5. [Database Schema — Full](#5-database-schema--full)
6. [Authentication System](#6-authentication-system)
7. [API Endpoints — Complete](#7-api-endpoints--complete)
8. [Website Pages — Every Page Specified](#8-website-pages--every-page-specified)
9. [User Roles & Permissions](#9-user-roles--permissions)
10. [Feature Specifications](#10-feature-specifications)
11. [Mobile App — React Native](#11-mobile-app--react-native)
12. [Payment Integration](#12-payment-integration)
13. [Security Requirements](#13-security-requirements)
14. [Performance Requirements](#14-performance-requirements)
15. [SEO Requirements](#15-seo-requirements)
16. [Notification System](#16-notification-system)
17. [Admin Panel](#17-admin-panel)
18. [Development Phases & Milestones](#18-development-phases--milestones)
19. [Environment Variables & Configuration](#19-environment-variables--configuration)
20. [Deployment & Infrastructure](#20-deployment--infrastructure)
21. [Testing Requirements](#21-testing-requirements)
22. [Rwanda-Specific Requirements](#22-rwanda-specific-requirements)
23. [Third-Party APIs & Keys Needed](#23-third-party-apis--keys-needed)
24. [Git Workflow](#24-git-workflow)
25. [Definition of Done](#25-definition-of-done)

---

## 1. PROJECT OVERVIEW

### What We Are Building

**MotorWa.rw** is Rwanda's first professional, verified, and fully digital car marketplace. Think of it as a mix between AutoTrader and Airbnb — but built specifically for how Rwandans buy, sell, and pay for cars.

The platform connects:
- **Private sellers** listing their personal cars
- **Private buyers** looking for trusted cars
- **Professional dealers** managing large inventories
- **Mechanics** offering pre-purchase inspections
- **Insurance and finance partners** serving buyers at point of sale

### What Makes This Different From a Generic Marketplace

- Rwanda National ID verification on every seller
- MTN Mobile Money + Airtel Money as PRIMARY payment methods (not afterthoughts)
- Built-in car inspection booking connected to a mechanic network
- Full Kinyarwanda + English bilingual support
- Designed mobile-first for low-end Android devices (Tecno, Itel, Samsung Galaxy A series)
- Interior car refurbishing service booking integrated post-purchase
- Works on 3G connections — not just fast LTE

### Platforms to Deliver

1. **Web Application** — motorwa.rw (React.js, server-side rendered)
2. **Mobile App** — iOS + Android (React Native with Expo)
3. **Admin Panel** — admin.motorwa.rw (React.js, protected)
4. **REST API** — api.motorwa.rw (Node.js + Express)

---

## 2. BRAND & DESIGN SYSTEM

### Identity

```
Platform Name:   MotorWa.rw
Tagline (EN):    Rwanda's Trusted Car Marketplace
Tagline (RW):    Ahantu h'imodoka mu Rwanda
```

### Color Palette

```css
/* PRIMARY */
--navy:          #0F2340;   /* primary brand — trust, authority */
--navy-light:    #1A3A5C;   /* hover states, secondary backgrounds */

/* ACCENT */
--gold:          #C8960C;   /* calls to action, highlights */
--gold-light:    #E8B020;   /* hover state for gold */
--gold-pale:     #FDF3D8;   /* gold tinted backgrounds */

/* NEUTRALS */
--cream:         #FAFAF7;   /* page background */
--white:         #FFFFFF;   /* card backgrounds */
--gray-100:      #F4F4F0;   /* zebra rows, alt backgrounds */
--gray-200:      #E8E8E2;   /* borders, dividers */
--gray-400:      #9A9A90;   /* placeholder text, secondary labels */
--gray-600:      #5A5A52;   /* body text */
--gray-900:      #1A1A16;   /* headings */

/* STATUS */
--success:       #1E8449;   /* confirmed, verified, approved */
--success-pale:  #E8F5E9;
--warning:       #F57F17;   /* pending, needs attention */
--warning-pale:  #FFF8E1;
--error:         #C0392B;   /* errors, bans, rejections */
--error-pale:    #FDECEA;
--info:          #1565C0;   /* informational states */
--info-pale:     #EAF2FB;
```

### Typography

```
Font Stack:
  Display (headings):   'Playfair Display', Georgia, serif
  Body (all text):      'DM Sans', system-ui, sans-serif
  Mono (code, IDs):     'DM Mono', monospace

Font Sizes (use rem):
  xs:   0.72rem  (11.5px)
  sm:   0.85rem  (13.5px)
  base: 1rem     (16px)
  lg:   1.125rem (18px)
  xl:   1.25rem  (20px)
  2xl:  1.5rem   (24px)
  3xl:  1.875rem (30px)
  4xl:  2.25rem  (36px)
  5xl:  3rem     (48px)

Font Weights:
  Light:    300
  Regular:  400
  Medium:   500
  Semibold: 600
  Bold:     700
  Black:    900
```

### Spacing System

```
Use 4px base unit. All spacing values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
```

### Border Radius

```
sm:   4px   (buttons, badges, tags)
md:   6px   (inputs, small cards)
lg:   12px  (cards, panels)
xl:   16px  (modals, large surfaces)
full: 9999px (pills, avatar)
```

### Shadows

```css
--shadow-sm:  0 1px 3px rgba(0,0,0,0.08);
--shadow-md:  0 4px 16px rgba(0,0,0,0.10);
--shadow-lg:  0 8px 32px rgba(0,0,0,0.13);
--shadow-xl:  0 16px 48px rgba(0,0,0,0.16);
```

### Component Patterns

```
Buttons:
  Primary:    bg=gold, text=navy, hover=gold-light, border-radius=6px
  Secondary:  bg=transparent, border=navy, text=navy, hover=bg navy/5
  Danger:     bg=error, text=white
  Ghost:      bg=transparent, text=gray-600, hover=gray-100

Inputs:
  border: 1px solid gray-200
  focus:  border-color=gold, box-shadow=0 0 0 3px gold/20
  error:  border-color=error
  border-radius: 6px
  padding: 10px 14px

Cards:
  bg=white, border=1px solid gray-200, border-radius=12px
  hover: box-shadow=shadow-md, transform=translateY(-2px)

Badges:
  Verified:  bg=success-pale, text=success, border=success/30
  Featured:  bg=gold-pale, text=gold, border=gold/30
  Dealer:    bg=navy, text=gold-light
  Pending:   bg=warning-pale, text=warning
  Sold:      bg=gray-100, text=gray-400
```

---

## 3. TECH STACK — REQUIRED

> Do not substitute any of these without written approval. Every choice below is deliberate.

### Backend

```
Runtime:        Node.js 20 LTS
Framework:      Express.js 4.x
Language:       TypeScript (strict mode)
ORM:            Prisma 5.x
Database:       PostgreSQL 15+
Cache:          Redis 7+
Real-time:      Socket.io 4.x
Auth:           Custom JWT (jsonwebtoken package)
File Upload:    Multer + Sharp (image processing)
Validation:     Zod
HTTP Client:    Axios (for external API calls)
Job Queue:      Bull (Redis-backed, for async tasks)
Email:          @sendgrid/mail
SMS:            africastalking npm package
Push:           firebase-admin
Password Hash:  bcryptjs (12 rounds minimum)
Logging:        Winston + Morgan
```

### Frontend (Website)

```
Framework:      Next.js 14+ (App Router) with TypeScript
Styling:        Tailwind CSS 3.x
Components:     shadcn/ui (built on Radix UI)
State:          Zustand 4.x
Data Fetching:  TanStack Query (React Query) v5
Forms:          React Hook Form + Zod resolver
Icons:          Lucide React
Maps:           @react-google-maps/api
Charts:         Recharts
Image:          Next/Image with blur placeholder
Animation:      Framer Motion (use sparingly)
Rich Text:      TipTap (blog editor in admin)
Date:           date-fns
```

### Mobile App

```
Framework:      React Native 0.73+ with Expo SDK 50
Language:       TypeScript
Navigation:     Expo Router (file-based routing)
State:          Zustand (shared with web where possible)
Data Fetching:  TanStack Query v5
Forms:          React Hook Form
Storage:        Expo SecureStore (tokens), AsyncStorage (cache)
Camera:         Expo Camera + Expo Image Picker
Location:       Expo Location
Notifications:  Expo Notifications + Firebase FCM
Biometrics:     Expo LocalAuthentication
Sharing:        Expo Sharing
Maps:           react-native-maps
```

### Infrastructure

```
Hosting:        DigitalOcean Droplets (Ubuntu 22.04 LTS)
Database Host:  DigitalOcean Managed PostgreSQL
Redis Host:     DigitalOcean Managed Redis
File Storage:   Cloudflare R2 (S3-compatible API)
CDN:            Cloudflare (free plan)
SSL:            Cloudflare (automatic)
DNS:            Cloudflare
CI/CD:          GitHub Actions
Monitoring:     Sentry (errors) + UptimeRobot (uptime)
Containers:     Docker (for local dev environment)
Process Mgr:    PM2 (production Node.js)
```

---

## 4. PROJECT STRUCTURE

### Repository Structure

```
motorwa-rw/
├── apps/
│   ├── web/                    # Next.js website (motorwa.rw)
│   ├── mobile/                 # React Native Expo app
│   └── admin/                  # Next.js admin panel (admin.motorwa.rw)
├── packages/
│   ├── api/                    # Express.js REST API
│   ├── database/               # Prisma schema + migrations
│   ├── shared/                 # Shared types, constants, utils
│   └── ui/                     # Shared UI components (optional)
├── docker-compose.yml          # Local dev: Postgres + Redis
├── .github/
│   └── workflows/
│       ├── deploy-api.yml
│       ├── deploy-web.yml
│       └── test.yml
└── README.md
```

### API Internal Structure

```
packages/api/src/
├── routes/
│   ├── auth.routes.ts
│   ├── listings.routes.ts
│   ├── users.routes.ts
│   ├── messages.routes.ts
│   ├── dealers.routes.ts
│   ├── payments.routes.ts
│   ├── inspections.routes.ts
│   ├── reviews.routes.ts
│   ├── admin.routes.ts
│   └── uploads.routes.ts
├── controllers/          # Route handlers
├── services/             # Business logic
├── middleware/
│   ├── auth.middleware.ts
│   ├── rateLimit.middleware.ts
│   ├── validate.middleware.ts
│   └── upload.middleware.ts
├── utils/
│   ├── jwt.ts
│   ├── otp.ts
│   ├── sms.ts
│   ├── email.ts
│   ├── storage.ts
│   └── notifications.ts
├── jobs/                 # Bull queue jobs
├── socket/               # Socket.io handlers
├── prisma/               # Prisma client instance
└── app.ts                # Express app entry
```

---

## 5. DATABASE SCHEMA — FULL

> Copy this into your Prisma schema file exactly. Every field is intentional.

```prisma
// packages/database/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ENUMS ───────────────────────────────────────

enum UserRole {
  USER
  DEALER
  ADMIN
}

enum ListingStatus {
  DRAFT
  PENDING_REVIEW
  ACTIVE
  SOLD
  EXPIRED
  REJECTED
}

enum FuelType {
  PETROL
  DIESEL
  HYBRID
  ELECTRIC
  OTHER
}

enum Transmission {
  MANUAL
  AUTOMATIC
}

enum CarCondition {
  EXCELLENT
  GOOD
  FAIR
  NEEDS_WORK
}

enum PaymentProvider {
  MTN
  AIRTEL
  CARD
  BANK_TRANSFER
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

enum PaymentType {
  LISTING_BOOST
  FEATURED_LISTING
  DEALER_SUBSCRIPTION
  INSPECTION_FEE
  BANNER_AD
}

enum InspectionStatus {
  REQUESTED
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum NotificationType {
  NEW_MESSAGE
  LISTING_APPROVED
  LISTING_REJECTED
  LISTING_EXPIRING
  PRICE_DROP
  NEW_REVIEW
  INSPECTION_UPDATE
  PAYMENT_SUCCESS
  PAYMENT_FAILED
  SYSTEM
}

enum ImportOrigin {
  JAPAN
  UAE
  SOUTH_AFRICA
  EUROPE
  LOCAL
  OTHER
}

enum Province {
  KIGALI
  NORTHERN
  SOUTHERN
  EASTERN
  WESTERN
}

// ─── MODELS ──────────────────────────────────────

model User {
  id                String    @id @default(uuid())
  phone             String    @unique
  phoneEncrypted    String?
  email             String?   @unique
  fullName          String
  profilePhotoUrl   String?
  province          Province?
  district          String?
  role              UserRole  @default(USER)
  isPhoneVerified   Boolean   @default(false)
  isIdVerified      Boolean   @default(false)
  isBanned          Boolean   @default(false)
  banReason         String?
  listingCount      Int       @default(0)
  averageRating     Float?
  reviewCount       Int       @default(0)
  language          String    @default("en")
  fcmToken          String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  lastLoginAt       DateTime?
  deletedAt         DateTime?

  // Relations
  listings          Listing[]
  dealer            Dealer?
  sentMessages      Message[]      @relation("SentMessages")
  buyerConversations Conversation[] @relation("BuyerConversations")
  sellerConversations Conversation[] @relation("SellerConversations")
  savedListings     SavedListing[]
  savedSearches     SavedSearch[]
  reviewsGiven      Review[]       @relation("ReviewsGiven")
  reviewsReceived   Review[]       @relation("ReviewsReceived")
  payments          Payment[]
  notifications     Notification[]
  otpCodes          OtpCode[]
  refreshTokens     RefreshToken[]
  phoneReveals      PhoneReveal[]  @relation("RevealedBy")
  phoneRevealsReceived PhoneReveal[] @relation("RevealedOf")
  reports           Report[]       @relation("ReporterReports")
  reportsAgainst    Report[]       @relation("ReportedUserReports")
  adminLogs         AdminLog[]
  idVerificationDocs IdVerificationDoc[]

  @@index([phone])
  @@index([role])
  @@index([createdAt])
}

model Listing {
  id              String        @id @default(uuid())
  userId          String
  title           String
  slug            String        @unique
  make            String
  model           String
  year            Int
  fuelType        FuelType
  transmission    Transmission
  mileageKm       Int
  condition       CarCondition
  priceRwf        BigInt
  isNegotiable    Boolean       @default(false)
  description     String
  province        Province
  district        String
  sector          String?
  importOrigin    ImportOrigin
  hasServiceHistory Boolean     @default(false)
  hasAccidentHistory Boolean    @default(false)
  videoUrl        String?
  status          ListingStatus @default(DRAFT)
  viewsCount      Int           @default(0)
  savesCount      Int           @default(0)
  isFeatured      Boolean       @default(false)
  isBoosted       Boolean       @default(false)
  boostedUntil    DateTime?
  featuredUntil   DateTime?
  expiresAt       DateTime?
  rejectionReason String?
  searchVector    String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  soldAt          DateTime?
  deletedAt       DateTime?

  // Relations
  user            User          @relation(fields: [userId], references: [id])
  photos          ListingPhoto[]
  specs           ListingSpec[]
  priceHistory    PriceHistory[]
  conversations   Conversation[]
  savedBy         SavedListing[]
  reviews         Review[]
  inspections     Inspection[]
  phoneReveals    PhoneReveal[]

  @@index([make, model, year])
  @@index([status, province])
  @@index([priceRwf])
  @@index([isFeatured, isBoosted])
  @@index([userId])
  @@index([createdAt])
  @@index([slug])
}

model ListingPhoto {
  id           String   @id @default(uuid())
  listingId    String
  photoUrl     String
  thumbnailUrl String
  isPrimary    Boolean  @default(false)
  displayOrder Int      @default(0)
  createdAt    DateTime @default(now())

  listing      Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@index([listingId, displayOrder])
}

model ListingSpec {
  id        String @id @default(uuid())
  listingId String
  specKey   String
  specValue String

  listing   Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@index([listingId])
}

model PriceHistory {
  id        String   @id @default(uuid())
  listingId String
  oldPrice  BigInt
  newPrice  BigInt
  changedAt DateTime @default(now())

  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@index([listingId, changedAt])
}

model Conversation {
  id             String    @id @default(uuid())
  listingId      String
  buyerId        String
  sellerId       String
  lastMessageAt  DateTime  @default(now())
  buyerArchived  Boolean   @default(false)
  sellerArchived Boolean   @default(false)
  createdAt      DateTime  @default(now())

  listing        Listing   @relation(fields: [listingId], references: [id])
  buyer          User      @relation("BuyerConversations", fields: [buyerId], references: [id])
  seller         User      @relation("SellerConversations", fields: [sellerId], references: [id])
  messages       Message[]

  @@unique([listingId, buyerId])
  @@index([buyerId, lastMessageAt])
  @@index([sellerId, lastMessageAt])
}

model Message {
  id             String       @id @default(uuid())
  conversationId String
  senderId       String
  content        String
  photoUrls      String[]
  isRead         Boolean      @default(false)
  sentAt         DateTime     @default(now())

  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender         User         @relation("SentMessages", fields: [senderId], references: [id])

  @@index([conversationId, sentAt])
  @@index([senderId])
}

model SavedListing {
  id        String   @id @default(uuid())
  userId    String
  listingId String
  savedAt   DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@unique([userId, listingId])
  @@index([userId])
}

model SavedSearch {
  id           String   @id @default(uuid())
  userId       String
  name         String?
  searchParams Json
  alertEnabled Boolean  @default(true)
  lastAlertedAt DateTime?
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Review {
  id                  String   @id @default(uuid())
  reviewerId          String
  reviewedUserId      String
  listingId           String?
  rating              Int
  comment             String?
  isVerifiedPurchase  Boolean  @default(false)
  sellerResponse      String?
  isFlagged           Boolean  @default(false)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  reviewer            User     @relation("ReviewsGiven", fields: [reviewerId], references: [id])
  reviewedUser        User     @relation("ReviewsReceived", fields: [reviewedUserId], references: [id])
  listing             Listing? @relation(fields: [listingId], references: [id])

  @@index([reviewedUserId])
  @@index([reviewerId])
}

model Dealer {
  id                 String   @id @default(uuid())
  userId             String   @unique
  businessName       String
  logoUrl            String?
  bannerUrl          String?
  description        String?
  address            String?
  district           String?
  province           Province?
  websiteUrl         String?
  operatingHours     Json?
  subscriptionPlan   String   @default("monthly")
  subscriptionStart  DateTime?
  subscriptionExpiry DateTime?
  isApproved         Boolean  @default(false)
  teamLimit          Int      @default(3)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  user               User     @relation(fields: [userId], references: [id])
  teamMembers        DealerTeamMember[]

  @@index([isApproved])
}

model DealerTeamMember {
  id       String @id @default(uuid())
  dealerId String
  userId   String
  role     String @default("agent")

  dealer   Dealer @relation(fields: [dealerId], references: [id], onDelete: Cascade)
}

model Inspection {
  id                   String          @id @default(uuid())
  listingId            String
  buyerId              String
  inspectorId          String?
  status               InspectionStatus @default(REQUESTED)
  scheduledAt          DateTime?
  completedAt          DateTime?
  reportUrl            String?
  reportNotes          String?
  feeRwf               Int
  platformCommissionRwf Int
  createdAt            DateTime        @default(now())
  updatedAt            DateTime        @updatedAt

  listing              Listing         @relation(fields: [listingId], references: [id])

  @@index([listingId])
  @@index([inspectorId])
}

model Inspector {
  id           String   @id @default(uuid())
  userId       String   @unique
  businessName String
  province     Province
  district     String
  address      String
  isVerified   Boolean  @default(false)
  rating       Float?
  reviewCount  Int      @default(0)
  createdAt    DateTime @default(now())
}

model Payment {
  id                String          @id @default(uuid())
  userId            String
  type              PaymentType
  amountRwf         Int
  provider          PaymentProvider
  providerReference String?         @unique
  idempotencyKey    String          @unique
  status            PaymentStatus   @default(PENDING)
  metadata          Json?
  failureReason     String?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  user              User            @relation(fields: [userId], references: [id])

  @@index([userId, status])
  @@index([providerReference])
  @@index([createdAt])
}

model Notification {
  id        String           @id @default(uuid())
  userId    String
  type      NotificationType
  title     String
  body      String
  data      Json?
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
  @@index([createdAt])
}

model BannerAd {
  id              String   @id @default(uuid())
  advertiserName  String
  imageUrl        String
  mobileImageUrl  String?
  linkUrl         String
  placement       String
  startDate       DateTime
  endDate         DateTime
  impressions     Int      @default(0)
  clicks          Int      @default(0)
  amountRwf       Int
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())

  @@index([isActive, placement])
}

model Report {
  id               String   @id @default(uuid())
  reporterId       String
  reportedUserId   String?
  reportedListingId String?
  reason           String
  details          String?
  status           String   @default("PENDING")
  adminNotes       String?
  resolvedAt       DateTime?
  createdAt        DateTime @default(now())

  reporter         User     @relation("ReporterReports", fields: [reporterId], references: [id])
  reportedUser     User?    @relation("ReportedUserReports", fields: [reportedUserId], references: [id])

  @@index([status])
}

model OtpCode {
  id        String   @id @default(uuid())
  userId    String?
  phone     String
  code      String
  attempts  Int      @default(0)
  isUsed    Boolean  @default(false)
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      User?    @relation(fields: [userId], references: [id])

  @@index([phone, isUsed])
}

model RefreshToken {
  id          String   @id @default(uuid())
  userId      String
  tokenHash   String   @unique
  deviceInfo  String?
  ipAddress   String?
  expiresAt   DateTime
  isRevoked   Boolean  @default(false)
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRevoked])
}

model PhoneReveal {
  id         String   @id @default(uuid())
  revealedBy String
  revealedOf String
  listingId  String?
  ipAddress  String?
  createdAt  DateTime @default(now())

  revealer   User     @relation("RevealedBy", fields: [revealedBy], references: [id])
  revealed   User     @relation("RevealedOf", fields: [revealedOf], references: [id])

  @@index([revealedOf])
  @@index([listingId])
}

model AdminLog {
  id         String   @id @default(uuid())
  adminId    String
  action     String
  targetType String?
  targetId   String?
  details    Json?
  ipAddress  String?
  createdAt  DateTime @default(now())

  admin      User     @relation(fields: [adminId], references: [id])

  @@index([adminId, createdAt])
}

model IdVerificationDoc {
  id        String   @id @default(uuid())
  userId    String
  frontUrl  String
  backUrl   String
  status    String   @default("PENDING")
  reviewedAt DateTime?
  reviewedBy String?
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 6. AUTHENTICATION SYSTEM

### Phone + OTP Flow (Primary)

```
Registration:
  POST /api/v1/auth/send-otp     → sends 6-digit OTP via Africa's Talking SMS
  POST /api/v1/auth/verify-otp   → verifies OTP, creates account if new, returns JWT
  POST /api/v1/auth/refresh       → uses httpOnly cookie refresh token, returns new access token
  POST /api/v1/auth/logout        → invalidates refresh token
  POST /api/v1/auth/logout-all    → invalidates ALL user refresh tokens

JWT Token Specifications:
  Access Token:
    - Algorithm: HS256
    - Expiry: 15 minutes
    - Payload: { userId, role, iat, exp }
    - Sent as: Authorization: Bearer <token> header

  Refresh Token:
    - Algorithm: HS256
    - Expiry: 30 days
    - Stored: httpOnly, Secure, SameSite=Strict cookie ONLY
    - Hashed with SHA-256 before storing in database
    - Rotated on every use — old token immediately revoked
    - Max 3 refresh tokens per user (oldest deleted when 4th is created)

OTP Security Rules:
  - 6-digit numeric code
  - Generated with crypto.randomInt() — never Math.random()
  - Expires: 5 minutes
  - Max 3 verification attempts before OTP is invalidated
  - Max 5 OTP requests per phone per hour (Redis counter)
  - Cooldown: 60 seconds between consecutive OTP requests
  - OTP stored as bcrypt hash in database — never plain text
```

### Auth Middleware

```typescript
// Every protected route must use this middleware
// Attach to req.user: { id, role, isVerified }

// Role guards:
requireAuth          // any logged-in user
requireDealer        // USER with dealer account
requireAdmin         // ADMIN role only
requireVerified      // user with isIdVerified = true
optionalAuth         // attach user if token valid, continue if not
```

---

## 7. API ENDPOINTS — COMPLETE

> All endpoints prefixed with `/api/v1/`
> All responses follow: `{ success: boolean, data?: any, error?: string, meta?: any }`

### Authentication

```
POST   /auth/send-otp              Public  Send OTP to phone
POST   /auth/verify-otp            Public  Verify OTP, login or register
POST   /auth/refresh               Public  Refresh access token (httpOnly cookie)
POST   /auth/logout                Auth    Invalidate current refresh token
POST   /auth/logout-all            Auth    Invalidate all refresh tokens
```

### Users

```
GET    /users/me                   Auth    Get own profile
PUT    /users/me                   Auth    Update own profile
PUT    /users/me/photo             Auth    Upload profile photo
DELETE /users/me                   Auth    Delete own account (soft delete)
POST   /users/me/verify-id         Auth    Submit ID verification documents
GET    /users/me/stats             Auth    Get listing views, saves, messages count
PUT    /users/me/fcm-token         Auth    Update Firebase push token
GET    /users/:id                  Public  Get public user profile
GET    /users/:id/reviews          Public  Get reviews for a user
GET    /users/:id/listings         Public  Get active listings for a user
```

### Listings

```
GET    /listings                   Public  Search & filter listings
GET    /listings/featured          Public  Get featured/boosted listings
GET    /listings/:id               Public  Get listing detail (increment view)
GET    /listings/:slug             Public  Get listing by slug
POST   /listings                   Auth    Create new listing (draft)
PUT    /listings/:id               Auth    Update listing (owner only)
DELETE /listings/:id               Auth    Soft delete listing (owner only)
PUT    /listings/:id/status        Auth    Change status (mark sold, etc.)
POST   /listings/:id/boost         Auth    Pay to boost listing
POST   /listings/:id/feature       Auth    Pay to feature listing
POST   /listings/:id/photos        Auth    Upload photos to listing
DELETE /listings/:id/photos/:photoId Auth  Delete a photo
PUT    /listings/:id/photos/reorder Auth  Reorder photos
POST   /listings/:id/report        Auth    Report a listing
GET    /listings/:id/similar       Public  Get similar listings
GET    /listings/:id/price-history Public  Get price change history
GET    /listings/:id/stats         Auth    Owner: views, saves, messages (owner only)
```

### Search

```
GET    /search?q=&make=&model=&year_min=&year_max=&price_min=&price_max=
               &fuel_type=&transmission=&condition=&province=&seller_type=
               &import_origin=&sort=&page=&limit=
               Public  Full search with all filters

GET    /search/makes              Public  Get all makes (for dropdown)
GET    /search/models?make=       Public  Get models for a make (for dropdown)
GET    /search/suggestions?q=     Public  Autocomplete suggestions
```

### Saved Listings & Searches

```
GET    /saved/listings            Auth    Get saved listings
POST   /saved/listings/:id        Auth    Save a listing
DELETE /saved/listings/:id        Auth    Unsave a listing
GET    /saved/searches            Auth    Get saved searches
POST   /saved/searches            Auth    Save a search with alert
DELETE /saved/searches/:id        Auth    Delete saved search
PUT    /saved/searches/:id/toggle Auth    Toggle alert on/off
```

### Messages

```
GET    /conversations             Auth    Get all conversations (paginated)
GET    /conversations/:id         Auth    Get conversation with messages
POST   /conversations             Auth    Start or get conversation (listingId required)
POST   /conversations/:id/messages Auth  Send a message
PUT    /conversations/:id/read    Auth    Mark all messages as read
DELETE /conversations/:id         Auth    Archive conversation
POST   /conversations/:id/report  Auth    Report a conversation/user
```

### Phone Reveal

```
POST   /listings/:id/reveal-phone Auth    Reveal seller phone (logged and rate-limited)
```

### Dealers

```
GET    /dealers                   Public  List all verified dealers (paginated, filterable)
GET    /dealers/:id               Public  Get dealer profile + listings
POST   /dealers/apply             Auth    Apply for dealer account
PUT    /dealers/me                Dealer  Update dealer profile
POST   /dealers/me/logo           Dealer  Upload dealer logo
POST   /dealers/me/banner         Dealer  Upload dealer banner
GET    /dealers/me/analytics      Dealer  Get dealer analytics
GET    /dealers/me/leads          Dealer  Get all inquiries/leads
POST   /dealers/me/team           Dealer  Add team member
DELETE /dealers/me/team/:userId   Dealer  Remove team member
```

### Reviews

```
GET    /reviews/user/:userId      Public  Get reviews for a user
POST   /reviews                   Auth    Create a review
PUT    /reviews/:id/response      Auth    Seller responds to review
POST   /reviews/:id/flag          Auth    Flag a suspicious review
```

### Inspections

```
GET    /inspections               Auth    Get own inspections
POST   /inspections               Auth    Book an inspection
GET    /inspections/:id           Auth    Get inspection details
PUT    /inspections/:id/status    Auth    Update inspection status (inspector)
POST   /inspections/:id/report    Auth    Upload inspection report (inspector)
GET    /inspectors                Public  List available inspectors
```

### Payments

```
POST   /payments/initiate         Auth    Initiate any payment (MTN/Airtel/card)
POST   /payments/mtn/callback     Public  MTN webhook callback (verify signature)
POST   /payments/airtel/callback  Public  Airtel webhook callback (verify signature)
GET    /payments/history          Auth    Get own payment history
GET    /payments/:id              Auth    Get single payment detail
```

### Notifications

```
GET    /notifications             Auth    Get notifications (paginated)
GET    /notifications/unread-count Auth   Get unread count
PUT    /notifications/:id/read    Auth    Mark as read
PUT    /notifications/read-all    Auth    Mark all as read
DELETE /notifications/:id         Auth    Delete notification
```

### Admin

```
GET    /admin/dashboard           Admin   Platform statistics overview
GET    /admin/listings            Admin   All listings with filters + pagination
PUT    /admin/listings/:id/approve Admin  Approve a listing
PUT    /admin/listings/:id/reject  Admin  Reject listing with reason
GET    /admin/users               Admin   All users with search
PUT    /admin/users/:id/ban       Admin   Ban a user
PUT    /admin/users/:id/unban     Admin   Unban a user
PUT    /admin/users/:id/verify-id Admin   Approve ID verification
POST   /admin/dealers/:id/approve Admin   Approve dealer application
GET    /admin/reports             Admin   All reports with filters
PUT    /admin/reports/:id/resolve Admin   Resolve a report
GET    /admin/payments            Admin   All payment transactions
POST   /admin/banners             Admin   Create banner ad
PUT    /admin/banners/:id         Admin   Update banner ad
DELETE /admin/banners/:id         Admin   Delete banner ad
POST   /admin/broadcast           Admin   Send broadcast email/notification
GET    /admin/logs                Admin   Admin audit logs
```

---

## 8. WEBSITE PAGES — EVERY PAGE SPECIFIED

### Layout Requirements

```
Navigation Bar (sticky, all pages):
  Left:  MotorWa.rw logo (links to homepage)
  Center: Search bar (desktop only, collapsed to icon on mobile)
  Right: Post Car button (gold), Messages icon with badge, User menu / Login button
  Mobile: Hamburger menu with all nav items
  
Footer (all public pages):
  Column 1: Logo, tagline in EN + RW, brief description
  Column 2: Quick links (Browse Cars, Post Car, Dealers, Pricing)
  Column 3: Company (About, Blog, Help, Contact)
  Column 4: Legal (Terms, Privacy, Cookie Policy)
  Bottom:   © 2025 MotorWa.rw | Accepted payments: MTN logo + Airtel logo
  Language: Toggle EN / Kinyarwanda in footer
```

### Page 1: Homepage (/)

```
SECTION 1 — Hero
  - Background: Navy gradient (#0F2340 → #1A3A5C)
  - Heading: "Rwanda's Trusted Car Marketplace" (large, white, Playfair Display)
  - Subheading: "Buy and sell cars safely — with verified sellers and real prices"
  - Search bar (large, white, rounded):
      Make dropdown | Model dropdown | Max Price (RWF) | Search Button (gold)
  - Below search: quick filter pills — SUV, Sedan, Pickup, Under 5M, Under 10M

SECTION 2 — Stats bar
  - 4 stats: Active Listings | Verified Sellers | Dealers | Cars Sold
  - Animated count-up on scroll into view

SECTION 3 — Featured Cars
  - Title: "Featured Listings"
  - Horizontal scroll on mobile, 4-column grid on desktop
  - Car card: photo, year/make/model, mileage, price in RWF (USD small below), province, seller badge
  - "View All" link

SECTION 4 — Browse by Category
  - Icon grid: SUV, Sedan, Pickup/Truck, Minivan, Hatchback, Van
  - Each links to search results filtered by body type

SECTION 5 — Latest Listings
  - Title: "Just Added"
  - 8-card grid (2 cols mobile, 3 cols tablet, 4 cols desktop)
  - "Browse All Cars" button (gold, centered below)

SECTION 6 — How It Works
  - 3 steps with icons:
    1. Post Your Car — Takes 5 minutes
    2. Connect With Buyers — Secure messaging
    3. Sell With Confidence — Verified buyers
  - Secondary: Buying steps mirror
  
SECTION 7 — Top Dealers
  - Horizontal scroll of dealer cards
  - Dealer card: logo, name, verified badge, province, car count, rating
  - "View All Dealers" link

SECTION 8 — Trust Signals
  - 3 cards: Verified Sellers | Pre-Purchase Inspections | Secure Payments
  - Navy background, gold accent icons

SECTION 9 — Banner Ad Slot
  - 728x90 desktop / 320x50 mobile
  - Shows placeholder if no active ad

SECTION 10 — Download App
  - App store + Google Play badges
  - Phone mockup showing app (Phase 4)
```

### Page 2: Search Results (/cars)

```
Layout: 2 columns — left sidebar filters (280px) + right results

LEFT SIDEBAR (desktop) / BOTTOM SHEET (mobile):
  - Clear All Filters link at top
  - Make (searchable dropdown)
  - Model (searchable dropdown, updates when make selected)
  - Year Range (min/max inputs)
  - Price Range (min/max inputs in RWF, slider)
  - Fuel Type (checkbox group)
  - Transmission (radio: Any / Manual / Automatic)
  - Condition (checkbox group)
  - Province (checkbox group — all Rwanda provinces)
  - Import Origin (checkbox group)
  - Seller Type (radio: Any / Private / Dealer)

RIGHT RESULTS AREA:
  - Results count + active filter tags (removable)
  - Sort dropdown: Newest | Lowest Price | Highest Price | Most Viewed
  - View toggle: Grid / List
  - Car cards (see Card spec below)
  - Pagination: previous/next + page numbers, OR infinite scroll (choose one — recommend pagination for SEO)

CAR CARD (grid view):
  - Photo (aspect ratio 4:3, object-fit cover)
  - Featured badge (if boosted)
  - Verified badge (if seller verified)
  - Year · Make · Model (heading)
  - Mileage | Fuel | Transmission (icon + text row)
  - Price in RWF (large, gold)  USD equivalent (small, gray)
  - Province + days since listed
  - Save button (heart icon, toggles)
  - On hover: subtle lift shadow

CAR CARD (list view):
  - Photo left (160px wide), all details right
  - Same information but horizontal layout

NO RESULTS STATE:
  - Friendly illustration
  - "No cars found matching your filters"
  - Suggest clearing filters or saving search for alerts
```

### Page 3: Car Detail (/cars/:slug)

```
BREADCRUMB: Home > Cars > Toyota > Camry > [title]

TOP SECTION (2 column on desktop, stacked on mobile):
  LEFT (60%):
    - Photo gallery: main large photo + thumbnail strip below
    - Clicking thumbnail updates main photo
    - Zoom on click (lightbox with arrow navigation)
    - Photo counter: "3 / 12"
    - Inspection report badge (if inspection exists): "✓ Inspected — View Report"
    - Sold overlay (if status = SOLD)

  RIGHT (40%):
    - Price: large RWF amount + USD equivalent small
    - Negotiable badge if applicable
    - Year · Make · Model · Province
    - Mileage | Fuel | Transmission | Condition (spec row)
    - Import origin tag
    - Days listed / Date listed

    SELLER BOX:
      - Profile photo + name
      - Verified badge (if ID verified)
      - Average rating + review count
      - Member since [month year]
      - ⬛ "Message Seller" button (navy, full width)
      - 📞 "Show Phone Number" button (outline)
      - 💬 "Chat on WhatsApp" button (green)

    ACTION BOX:
      - 🔧 "Book Pre-Purchase Inspection" (if no inspection yet)
      - ♡ Save / Unsave listing
      - 🔗 Share listing

    PRICE HISTORY:
      - Small line chart showing price changes over time
      - "Price dropped [X]% since listed" if applicable

MIDDLE SECTION:
  - Full description (collapsible if > 500 chars)
  - Specs table (all technical details in 2-col table)
  - Service history + accident history declarations

BOTTOM SECTION:
  - "Similar Cars" — 4 car cards
  - Reviews section (for seller)
  - "Report This Listing" small link

STICKY BOTTOM BAR (mobile only):
  - Price left
  - "Message" button + "Call" button right
```

### Page 4: Post Listing (/post)

```
Protected route — requires login

STEP INDICATOR: [1] [2] [3] [4] [5] with labels and progress bar

STEP 1 — Vehicle Details
  Make (searchable dropdown, 200+ makes)
  Model (updates based on make)
  Year (dropdown 1990–current year)
  Fuel Type (visual button group)
  Transmission (visual button group: Manual / Automatic)
  Mileage (number input, km)
  Condition (4 option visual cards with descriptions)
  Import Origin (dropdown)
  Service History (toggle: Yes / No)
  Accident History (toggle: Yes / No / Unknown)

STEP 2 — Photos
  Drag and drop zone (accepts JPEG, PNG, WebP, max 10MB each)
  Camera capture button on mobile
  Minimum 3 photos required, maximum 30
  Drag to reorder
  Primary photo selection (star icon)
  Real-time upload progress per photo
  Preview thumbnails with delete button

STEP 3 — Price & Description
  Price (number input in RWF)
    - Auto-shows USD equivalent below
    - "Market Range for this car: RWF X – Y" (Phase 2)
  Negotiable toggle
  Description (rich textarea, 2000 char limit, char counter)
  Optional: YouTube video link

STEP 4 — Location & Contact
  Province (dropdown)
  District (dropdown, updates based on province)
  Sector (optional text)
  "Use my current location" button (GPS auto-fill)
  Contact preference: Messages only / Messages + Phone / All

STEP 5 — Review & Publish
  Full preview of listing as it will appear
  Summary: photos count, price, location
  Terms agreement checkbox
  "Publish Listing" button (gold, large)
  "Save as Draft" secondary option

AUTOSAVE: Draft saved to localStorage and server every 30 seconds
VALIDATION: Each step validates before allowing Next
BACK BUTTON: Returns to previous step without losing data
```

### Page 5: User Dashboard (/dashboard)

```
SIDEBAR NAVIGATION (desktop left, bottom tabs mobile):
  - Overview
  - My Listings
  - Messages [unread count badge]
  - Saved Cars
  - Settings
  - Upgrade to Dealer (highlighted if not dealer)

OVERVIEW PAGE:
  - Welcome: "Hello [name]" + profile completeness bar
  - Stats cards: Active Listings | Total Views | Messages | Saved Cars
  - Recent listing activity
  - Recent messages preview (last 3)
  - Quick action: "Post New Car" button

MY LISTINGS:
  - Filter tabs: All | Active | Pending | Sold | Expired
  - Listing row: thumbnail, title, price, status badge, views, saves, messages
  - Actions per listing: Edit | Boost | Mark Sold | Renew | Delete
  - Boost button opens payment modal

MESSAGES:
  - Left panel: conversation list (sorted by most recent)
    - Unread messages shown in bold
    - Conversation preview: other user photo, name, listing thumbnail, last message snippet
  - Right panel: message thread
    - Messages grouped by date
    - Read receipts (single tick = sent, double tick = read)
    - Photo attachments (clickable to enlarge)
    - "Show Phone Number" button in thread header
    - Report user button in thread options

SAVED CARS:
  - Grid of saved listings
  - Price change alert shown ("Price dropped RWF 200,000!")
  - Remove button per card

SETTINGS:
  - Profile section: photo, name, email, province
  - Phone: current number shown, "Change" requires new OTP verification
  - Notifications: toggle per type (email, SMS, push) per event
  - Language: English / Kinyarwanda
  - Danger zone: Delete Account
```

### Page 6: Dealer Profile (/dealers/:slug)

```
HERO:
  - Full-width banner image (if uploaded)
  - Dealer logo (overlaid bottom-left)
  - Business name (large)
  - Verified Dealer badge
  - Rating stars + review count
  - Location + province

INFO STRIP:
  - Operating hours
  - Phone number (if public)
  - WhatsApp link
  - Website link (if provided)

LISTINGS GRID:
  - Filter: All / Available / Reserved
  - Sort: Newest / Lowest / Highest
  - Standard car cards

REVIEWS TAB:
  - Star distribution chart
  - Review cards with verified purchase badge
```

### Page 7: Pricing (/pricing)

```
Toggle: Monthly / Annual (annual shows discount)

3 COLUMNS:
  FREE          STANDARD        DEALER
  RWF 0         3,000/listing   50,000/month

Feature checklist per column with checkmarks.
"Get Started" / "Upgrade Now" / "Contact Us" CTAs.

FAQ ACCORDION below pricing table.
Payment method logos: MTN Money + Airtel Money + Visa/MC
```

---

## 9. USER ROLES & PERMISSIONS

```typescript
// Permission matrix — implement as middleware guards

const permissions = {
  // Listings
  'listings:create':      ['USER', 'DEALER', 'ADMIN'],
  'listings:edit:own':    ['USER', 'DEALER', 'ADMIN'],
  'listings:delete:own':  ['USER', 'DEALER', 'ADMIN'],
  'listings:approve':     ['ADMIN'],
  'listings:reject':      ['ADMIN'],
  'listings:edit:any':    ['ADMIN'],

  // Users
  'users:ban':            ['ADMIN'],
  'users:verify':         ['ADMIN'],
  'users:view:all':       ['ADMIN'],

  // Dealers
  'dealer:apply':         ['USER'],
  'dealer:manage:own':    ['DEALER'],
  'dealer:approve':       ['ADMIN'],

  // Messages
  'messages:send':        ['USER', 'DEALER', 'ADMIN'],
  'messages:view:own':    ['USER', 'DEALER', 'ADMIN'],

  // Reviews
  'reviews:create':       ['USER', 'DEALER'],
  'reviews:moderate':     ['ADMIN'],

  // Payments
  'payments:initiate':    ['USER', 'DEALER'],
  'payments:view:all':    ['ADMIN'],

  // Admin
  'admin:dashboard':      ['ADMIN'],
  'admin:broadcast':      ['ADMIN'],
}
```

---

## 10. FEATURE SPECIFICATIONS

### Search System

```
Database approach (Phase 1-2):
  - PostgreSQL full-text search using tsvector
  - Trigger to auto-update search_vector on listing insert/update
  - GIN index on search_vector column
  - Query: WHERE search_vector @@ plainto_tsquery('english', ?)

  CREATE INDEX listings_search_idx ON listings USING GIN(search_vector);

  -- Auto-update trigger
  CREATE TRIGGER listings_search_update
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION
  tsvector_update_trigger(search_vector, 'pg_catalog.english', title, make, model, description);

Filtering:
  All filters applied as WHERE clauses
  Province filter: WHERE province = ANY(?::text[])
  Price range: WHERE price_rwf BETWEEN ? AND ?
  Year range: WHERE year BETWEEN ? AND ?

Sorting:
  Newest: ORDER BY is_featured DESC, is_boosted DESC, created_at DESC
  Price low: ORDER BY is_featured DESC, price_rwf ASC
  Price high: ORDER BY price_featured DESC, price_rwf DESC
  Views: ORDER BY views_count DESC

Redis caching:
  Cache popular search results for 5 minutes
  Cache key: search:{hash of query params}
  Invalidate cache when new listing added to matching filters
```

### Image Upload & Processing

```typescript
// Required processing on every uploaded listing image:

1. Validate: JPEG, PNG, WebP only. Max 10MB. Min 400x300px.
2. Strip EXIF metadata (privacy — removes GPS coordinates)
3. Scan for prohibited content (use Sightengine or similar API)
4. Resize to:
   - Original: max 1920x1440, quality 85%, WebP
   - Large: 800x600, quality 80%, WebP
   - Thumbnail: 320x240, quality 75%, WebP
5. Add watermark: "MotorWa.rw" text in bottom-right corner
6. Upload all 3 sizes to Cloudflare R2
7. Store URLs in listing_photos table
8. Return: { originalUrl, largeUrl, thumbnailUrl }

// Use Sharp for all image processing
// Use Multer for upload handling
// Use Bull queue for async processing (don't block the request)
```

### Real-Time Messaging

```typescript
// Socket.io implementation

// Namespace: /messages

// On connect: authenticate via JWT query param
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // verify JWT, attach user to socket
});

// Rooms: each conversation is a room
// Room name: `conversation:${conversationId}`

// Events emitted by server:
'new_message'      // { conversationId, message }
'message_read'     // { conversationId, readBy }
'user_typing'      // { conversationId, userId }
'user_stop_typing' // { conversationId, userId }

// Events received from client:
'join_conversation'   // { conversationId }
'leave_conversation'  // { conversationId }
'send_message'        // { conversationId, content, photoUrls? }
'typing_start'        // { conversationId }
'typing_stop'         // { conversationId }
'mark_read'           // { conversationId }
```

### Listing Boost / Feature System

```
When user boosts a listing:
1. Create payment record with idempotency key
2. Initiate MTN/Airtel payment
3. On payment webhook success:
   - Set listing.isBoosted = true
   - Set listing.boostedUntil = now + 7 days (or 30 days)
   - Clear relevant Redis cache
   - Send confirmation notification

Boosted listings appear:
   - Top of search results (before non-boosted, sorted by boostedUntil DESC)
   - "Featured" gold badge on card
   - Highlighted border on card

Auto-expiry:
   - Bull cron job runs every hour
   - Sets isBoosted = false for listings where boostedUntil < now
```

---

## 11. MOBILE APP — REACT NATIVE

### Expo Router File Structure

```
apps/mobile/app/
├── (auth)/
│   ├── login.tsx           # Phone input
│   └── verify.tsx          # OTP input
├── (tabs)/
│   ├── index.tsx           # Home tab
│   ├── browse.tsx          # Search/Browse tab
│   ├── post.tsx            # Post Car tab
│   ├── messages.tsx        # Messages tab
│   └── profile.tsx         # Profile/Dashboard tab
├── cars/
│   └── [id].tsx            # Car detail screen
├── dealers/
│   └── [id].tsx            # Dealer profile screen
├── conversation/
│   └── [id].tsx            # Message thread screen
├── notifications.tsx
├── settings.tsx
├── onboarding.tsx
└── _layout.tsx             # Root layout with auth check
```

### Mobile API Service

```typescript
// Shared API service — same endpoints as web
// Use TanStack Query for caching and background refresh
// Store auth tokens in Expo SecureStore (NOT AsyncStorage)

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// Intercept 401 responses → attempt token refresh → retry
// On refresh failure → redirect to login
```

### Push Notifications

```typescript
// On app launch:
1. Request push notification permission (Expo Notifications)
2. Get Expo push token
3. Register token with Firebase FCM
4. Send FCM token to our API (PUT /users/me/fcm-token)

// On notification received:
- App in foreground: show in-app banner
- App in background: system notification (tap to open relevant screen)
- App closed: system notification with deep link

// Notification types to handle:
NEW_MESSAGE     → navigate to conversation/:id
LISTING_APPROVED → navigate to dashboard/listings
PRICE_DROP      → navigate to cars/:id
INSPECTION_UPDATE → navigate to inspections/:id
```

---

## 12. PAYMENT INTEGRATION

### MTN Mobile Money

```typescript
// API: MTN MoMo Collection API (developer.mtn.com)
// Apply for Rwanda sandbox first, then production

// Step 1: Create API user (done once via MTN portal)
// Step 2: Get subscription key from MTN developer portal

// Initiate collection:
const initiatePayment = async ({
  amount,        // integer in RWF
  currency,      // "RWF"
  externalId,    // our payment.id (idempotency)
  payerPhone,    // user's MTN number (international format: 2507XXXXXXXX)
  description,   // "MotorWa.rw - Featured Listing"
}) => {
  const response = await axios.post(
    `${MTN_BASE_URL}/collection/v1_0/requesttopay`,
    { amount, currency, externalId, payer: { partyIdType: 'MSISDN', partyId: payerPhone }, payerMessage: description, payeeNote: description },
    { headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Reference-Id': externalId,
        'X-Target-Environment': 'production', // or 'sandbox'
        'Ocp-Apim-Subscription-Key': MTN_SUBSCRIPTION_KEY,
        'Content-Type': 'application/json',
    }}
  );
  // Status 202 = payment initiated, user gets USSD push
};

// Poll for status (or use webhook callback):
const checkPaymentStatus = async (referenceId) => {
  const { data } = await axios.get(
    `${MTN_BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
    { headers: { ... } }
  );
  // data.status: PENDING | SUCCESSFUL | FAILED
};

// Webhook (preferred over polling):
// MTN sends POST to your /payments/mtn/callback endpoint
// Verify signature before processing
// Update payment status in database
// Grant access or trigger listing boost
```

### Airtel Money

```typescript
// API: Airtel Africa Developer Portal (developers.airtel.africa)
// Rwanda endpoint: https://openapi.airtel.africa

// Auth: Get OAuth token first
const getAirtelToken = async () => {
  const { data } = await axios.post(`${AIRTEL_BASE_URL}/auth/oauth2/token`, {
    client_id: AIRTEL_CLIENT_ID,
    client_secret: AIRTEL_CLIENT_SECRET,
    grant_type: 'client_credentials',
  });
  return data.access_token; // Cache this, expires in ~1 hour
};

// Initiate collection (payment request):
const initiateAirtelPayment = async ({ amount, phone, reference, description }) => {
  await axios.post(`${AIRTEL_BASE_URL}/merchant/v1/payments/`, {
    reference,
    subscriber: { country: 'RW', currency: 'RWF', msisdn: phone },
    transaction: { amount, country: 'RW', currency: 'RWF', id: reference },
  }, { headers: { Authorization: `Bearer ${token}`, 'X-Country': 'RW', 'X-Currency': 'RWF' } });
};
```

### Payment Security

```typescript
// CRITICAL: Verify all webhook signatures before processing
// Both MTN and Airtel send a signature in the header
// Validate using HMAC-SHA256 with your webhook secret

// CRITICAL: Use idempotency keys
// Store payment.idempotencyKey UNIQUE in database
// Before initiating payment: check if idempotency key already exists
// If exists and status = SUCCESS: return existing payment (don't charge again)

// CRITICAL: Validate amount server-side
// Client sends: { listingId, boostType: '7days' }
// Server looks up PRICE from database (never trust client amount)
// Server initiates payment with correct amount

// CRITICAL: Log everything
// Every webhook received, every status change, every refund
```

---

## 13. SECURITY REQUIREMENTS

### Middleware Stack (apply in this order)

```typescript
app.use(helmet());                    // Security headers
app.use(cors(corsOptions));           // CORS whitelist
app.use(express.json({ limit: '10kb' })); // Body size limit
app.use(rateLimit(globalLimiter));    // Global rate limit
app.use(mongoSanitize());             // NoSQL injection prevention
app.use(xss());                       // XSS sanitization
app.use(morgan('combined', { stream: winstonStream })); // Logging
```

### Rate Limiting Rules

```typescript
// Global: 200 requests per 15 minutes per IP (unauthenticated)
// Authenticated: 500 requests per 15 minutes per user

// Specific limits:
const limits = {
  '/auth/send-otp':      { max: 5,   windowMs: 60 * 60 * 1000 }, // 5/hour
  '/auth/verify-otp':    { max: 10,  windowMs: 60 * 60 * 1000 }, // 10/hour
  '/listings':           { max: 20,  windowMs: 60 * 60 * 1000 }, // 20 posts/hour
  '/messages':           { max: 100, windowMs: 60 * 60 * 1000 }, // 100/hour
  '/listings/*/reveal':  { max: 10,  windowMs: 60 * 60 * 1000 }, // 10 reveals/hour
};

// Use Redis store for distributed rate limiting (not memory store)
```

### Input Validation (Zod schemas for every endpoint)

```typescript
// Example — never trust any input:
const createListingSchema = z.object({
  make:         z.string().min(1).max(50),
  model:        z.string().min(1).max(50),
  year:         z.number().int().min(1990).max(new Date().getFullYear() + 1),
  fuelType:     z.enum(['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC', 'OTHER']),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']),
  mileageKm:    z.number().int().min(0).max(1000000),
  priceRwf:     z.number().int().min(100000).max(500000000),
  description:  z.string().min(20).max(2000),
  province:     z.enum(['KIGALI', 'NORTHERN', 'SOUTHERN', 'EASTERN', 'WESTERN']),
  // etc.
});
```

### Security Checklist

```
□ All secrets in .env — never committed to Git
□ .env in .gitignore from day 1 (check: git will never track it)
□ SSH key-only server access (disable password auth)
□ Firewall: ufw allow 80, 443, 22 from whitelist only
□ Admin routes: separate subdomain + IP allowlist middleware
□ EXIF stripped from all uploaded photos
□ Private S3 bucket for ID documents (presigned URLs only)
□ Passwords: bcrypt with 12 rounds minimum
□ OTP stored as bcrypt hash (never plaintext)
□ SQL injection: parameterized queries via Prisma only (never raw with user input)
□ XSS: sanitize all user-generated content before storage and rendering
□ CSRF: not needed if using JWT (no cookies for auth on web requests)
□ Secure cookies: httpOnly=true, Secure=true, SameSite=Strict
□ Audit log: every admin action logged immutably
□ Duplicate detection: image hash comparison before listing approval
□ Database backups: daily automated, tested monthly
```

---

## 14. PERFORMANCE REQUIREMENTS

```
Page load time (4G, Rwanda):    < 3 seconds
Time to First Byte (TTFB):     < 600ms
Largest Contentful Paint:       < 2.5 seconds
First Input Delay:              < 100ms
Cumulative Layout Shift:        < 0.1
API response (cached):          < 100ms
API response (uncached):        < 800ms
Image loading:                  Progressive (blur → sharp via BlurHash)
Search results:                 < 1 second

How to hit these targets:
- Next.js SSR for all public pages (listings indexed by Google)
- Static generation for homepage, pricing, about pages
- Redis cache for popular search queries (5-minute TTL)
- Redis cache for homepage data (2-minute TTL)
- Image CDN via Cloudflare (automatic WebP conversion)
- next/image for all images (automatic optimization + lazy load)
- Code splitting: each page loads only its own JavaScript
- Database: explain analyze all slow queries, add indexes
- Database: use connection pooling (PgBouncer or Prisma connection limit)
```

---

## 15. SEO REQUIREMENTS

```typescript
// Every listing page must have:
export function generateMetadata({ params }): Metadata {
  return {
    title: `${year} ${make} ${model} for sale in ${district}, Rwanda | MotorWa`,
    description: `Buy this ${year} ${make} ${model} — ${mileage}km, ${condition} condition, ${fuelType}. Located in ${district}, ${province}. Price: RWF ${price}. View photos and contact seller on MotorWa.rw`,
    openGraph: {
      title: ...,
      description: ...,
      images: [primaryPhotoUrl],
      type: 'website',
    },
    // JSON-LD structured data (see below)
  };
}

// JSON-LD for listing pages:
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": `${year} ${make} ${model}`,
  "description": listing.description,
  "image": listing.photos.map(p => p.photoUrl),
  "offers": {
    "@type": "Offer",
    "price": listing.priceRwf,
    "priceCurrency": "RWF",
    "availability": listing.status === 'ACTIVE' ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    "url": `https://motorwa.rw/cars/${listing.slug}`,
  }
};

// Sitemap: auto-generate /sitemap.xml
// Include: all active listing pages, dealer pages, blog posts, static pages
// Update: on new listing published, on listing sold/expired

// Robots.txt:
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /api/
Sitemap: https://motorwa.rw/sitemap.xml
```

---

## 16. NOTIFICATION SYSTEM

### Events That Trigger Notifications

```typescript
const notificationEvents = {
  // Messaging
  'message.received': {
    push: true,
    email: true,
    sms: false,
    inApp: true,
    title: 'New message from {senderName}',
    body: '{messagePreview}',
  },

  // Listings
  'listing.approved': {
    push: true, email: true, sms: true, inApp: true,
    title: 'Your listing is live!',
    body: 'Your {make} {model} is now visible to buyers.',
  },
  'listing.rejected': {
    push: true, email: true, sms: false, inApp: true,
    title: 'Listing needs changes',
    body: 'Your listing was not approved. Reason: {reason}',
  },
  'listing.expiring': {
    push: true, email: true, sms: false, inApp: true,
    title: 'Your listing expires in 3 days',
    body: 'Renew your {make} {model} to keep it visible.',
  },

  // Saved searches
  'saved_search.match': {
    push: true, email: true, sms: false, inApp: true,
    title: 'New car matches your search',
    body: 'A {make} {model} was just listed in {province}.',
  },

  // Price drops
  'listing.price_drop': {
    push: true, email: false, sms: false, inApp: true,
    title: 'Price dropped on saved car',
    body: '{make} {model} price reduced to RWF {newPrice}.',
  },

  // Payments
  'payment.success': {
    push: true, email: true, sms: true, inApp: true,
    title: 'Payment confirmed',
    body: 'Your payment of RWF {amount} was successful.',
  },

  // Inspections
  'inspection.confirmed': {
    push: true, email: true, sms: true, inApp: true,
    title: 'Inspection confirmed',
    body: 'Your inspection is scheduled for {date}.',
  },
  'inspection.report_ready': {
    push: true, email: true, sms: false, inApp: true,
    title: 'Inspection report ready',
    body: 'The inspection report for {make} {model} is ready to view.',
  },
};
```

---

## 17. ADMIN PANEL

### Admin Panel Pages

```
Dashboard (/admin):
  - Real-time stats: users today, listings today, revenue today, active listings
  - Charts: user growth (7/30/90 days), revenue by type, listing status distribution
  - Recent activity feed: last 20 actions across platform

Listings (/admin/listings):
  - Filter: status, province, make, date range
  - Approve / Reject / Edit / Delete actions
  - Bulk actions: approve selected, reject selected
  - Priority queue: show PENDING_REVIEW first

Users (/admin/users):
  - Search by name, phone, email
  - Filter: role, verified status, banned status
  - User detail: all listings, all payments, all messages (metadata only)
  - Actions: verify ID, ban (with reason), unban, change role

Payments (/admin/payments):
  - All transactions with filter by type, provider, status, date
  - Total revenue by period
  - Export to CSV

Reports (/admin/reports):
  - All reports sorted by newest
  - Filter by status (pending/resolved)
  - View reported listing/user
  - Resolve with admin notes

Dealers (/admin/dealers):
  - All dealer applications
  - Approve / Reject dealer applications
  - View dealer stats

Banners (/admin/banners):
  - Create new banner ad (upload image, set dates, placement, link)
  - View active banners
  - Performance: impressions, clicks, CTR

Broadcast (/admin/broadcast):
  - Compose message (title + body)
  - Audience: All users / Dealers only / Verified users / Province filter
  - Channels: Push + Email + In-App
  - Schedule or send now
  - Preview before sending

Audit Log (/admin/logs):
  - All admin actions with timestamp, admin user, action, target
  - Immutable — no delete button
  - Export to CSV
```

---

## 18. DEVELOPMENT PHASES & MILESTONES

### Phase 1 — Foundation (Weeks 1–4)
**Milestone: Functional listings and authentication. Internal use only.**

```
Week 1:
  □ Set up monorepo structure
  □ Docker compose for local dev (Postgres + Redis)
  □ Database: All Prisma models + migrations
  □ API: Express app setup with middleware stack
  □ API: Auth routes (send-otp, verify-otp, refresh, logout)
  □ Africa's Talking SMS integration (test mode)
  □ JWT implementation with refresh token rotation

Week 2:
  □ API: User CRUD endpoints
  □ API: Listing CRUD endpoints (no photos yet)
  □ API: File upload + Sharp image processing + R2 storage
  □ Next.js setup with Tailwind + shadcn/ui
  □ Design system implementation (colors, fonts, components)
  □ Responsive layout: header + footer + nav

Week 3:
  □ Frontend: Login/register with OTP flow
  □ Frontend: Homepage (static first, real data next)
  □ Frontend: Basic listing creation (form only, no wizard yet)
  □ API: Search endpoint with basic filters
  □ Redis setup: caching + rate limiting

Week 4:
  □ GitHub Actions CI/CD pipeline
  □ DigitalOcean server provisioned
  □ Domain + Cloudflare + SSL configured
  □ Sentry + UptimeRobot configured
  □ Phase 1 review: founder tests everything
```

### Phase 2 — Core Marketplace (Weeks 5–10)
**Milestone: Real sellers, real listings, real messages. Invite-only beta.**

```
Week 5-6:
  □ 5-step listing wizard with photo upload and drag reorder
  □ Search results page with all filters
  □ Car detail page complete (gallery, specs, seller info)
  □ Socket.io real-time messaging
  □ Dashboard: my listings, manage listings
  □ Dashboard: messages inbox + thread view

Week 7-8:
  □ Save listing + save search with alert
  □ Price history tracking + chart
  □ Phone number reveal with logging
  □ Report listing system
  □ Admin panel: listing approval queue
  □ Admin panel: user management
  □ Photo watermarking on upload
  □ Email notifications (SendGrid)

Week 9-10:
  □ User review + rating system
  □ Dealer profile pages (public)
  □ All Dealers listing page
  □ ID verification submission
  □ Admin: ID verification review
  □ Performance: Redis caching on search + homepage
  □ SEO: meta tags, sitemap, robots.txt, JSON-LD
  □ Beta launch with 20 invited dealers
```

### Phase 3 — Monetization (Weeks 11–18)
**Milestone: Platform earns money. Public launch.**

```
Week 11-13:
  □ MTN Mobile Money full integration (sandbox + production)
  □ Airtel Money full integration (sandbox + production)
  □ Card payments via DPO Group or Stripe
  □ Payment webhook handling with signature verification
  □ Listing boost / feature system
  □ Bull queue for async jobs (listing expiry, alerts)

Week 14-16:
  □ Dealer account upgrade + subscription management
  □ Dealer portal: leads dashboard, analytics
  □ Dealer subscription auto-renewal with payment
  □ Inspection booking system + inspector network
  □ Banner ad management in admin
  □ Pricing page
  □ Blog section (markdown-based)

Week 17-18:
  □ Security audit by external party or detailed self-audit
  □ Penetration testing
  □ Load testing (1,000 concurrent users)
  □ Cross-browser QA (Chrome, Firefox, Safari, Samsung Internet)
  □ Mobile responsiveness QA on 5 device sizes
  □ Legal documents published
  □ Public launch 🚀
```

### Phase 4 — Mobile App (Weeks 19–28)
**Milestone: iOS and Android live on stores.**

```
Week 19-21:  All app screens built (see Section 11)
Week 22-23:  Push notifications, camera, GPS, biometrics
Week 24-25:  Offline caching, dark mode, performance optimization
Week 26-27:  Testing on physical devices (Android + iPhone)
Week 28:     App Store + Google Play submission and approval
```

### Phase 5 — Scale (Month 7+)

```
□ Kinyarwanda full language implementation (i18n with next-intl)
□ Car valuation tool
□ Insurance API integration (SANLAM Rwanda)
□ Car financing integration (Bank of Kigali)
□ AI recommendations (collaborative filtering)
□ Elasticsearch for superior search at scale
□ Multi-province expansion with local dealers
```

---

## 19. ENVIRONMENT VARIABLES & CONFIGURATION

```bash
# packages/api/.env

# Database
DATABASE_URL="postgresql://user:password@host:5432/motorwa_prod?schema=public&connection_limit=10"
REDIS_URL="redis://default:password@host:6379"

# Auth
JWT_ACCESS_SECRET="[generate: openssl rand -hex 64]"
JWT_REFRESH_SECRET="[generate: openssl rand -hex 64]"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="30d"

# Africa's Talking (SMS)
AT_API_KEY="[from africastalking.com dashboard]"
AT_USERNAME="[your AT username]"
AT_SENDER_ID="MotorWa"
AT_ENV="production"  # or "sandbox"

# Cloudflare R2 (File Storage)
R2_ACCOUNT_ID="[Cloudflare account ID]"
R2_ACCESS_KEY_ID="[R2 access key]"
R2_SECRET_ACCESS_KEY="[R2 secret key]"
R2_BUCKET_NAME="motorwa-media"
R2_PUBLIC_URL="https://media.motorwa.rw"

# MTN Mobile Money
MTN_BASE_URL="https://proxy.momoapi.mtn.com"
MTN_SUBSCRIPTION_KEY="[from MTN developer portal]"
MTN_API_USER="[UUID generated during onboarding]"
MTN_API_KEY="[from MTN portal]"
MTN_TARGET_ENV="production"
MTN_WEBHOOK_SECRET="[generate: openssl rand -hex 32]"

# Airtel Money
AIRTEL_BASE_URL="https://openapi.airtel.africa"
AIRTEL_CLIENT_ID="[from Airtel developer portal]"
AIRTEL_CLIENT_SECRET="[from Airtel developer portal]"
AIRTEL_WEBHOOK_SECRET="[generate: openssl rand -hex 32]"

# SendGrid (Email)
SENDGRID_API_KEY="SG.[your key]"
SENDGRID_FROM_EMAIL="hello@motorwa.rw"
SENDGRID_FROM_NAME="MotorWa.rw"

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID="motorwa-rw"
FIREBASE_CLIENT_EMAIL="[from Firebase service account]"
FIREBASE_PRIVATE_KEY="[from Firebase service account JSON]"

# Stripe (Card Payments - optional)
STRIPE_SECRET_KEY="sk_live_[key]"
STRIPE_WEBHOOK_SECRET="whsec_[key]"

# Google Maps
GOOGLE_MAPS_API_KEY="[from Google Cloud Console]"

# Sentry
SENTRY_DSN="https://[key]@o[id].ingest.sentry.io/[project-id]"

# App Config
NODE_ENV="production"
PORT=3001
FRONTEND_URL="https://motorwa.rw"
ADMIN_URL="https://admin.motorwa.rw"
API_URL="https://api.motorwa.rw"
ADMIN_IP_WHITELIST="[comma-separated IPs allowed to access /admin routes]"

# apps/web/.env.local
NEXT_PUBLIC_API_URL="https://api.motorwa.rw"
NEXT_PUBLIC_GOOGLE_MAPS_KEY="[key]"
NEXT_PUBLIC_SENTRY_DSN="[dsn]"
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-[id]"
```

---

## 20. DEPLOYMENT & INFRASTRUCTURE

### Server Setup (DigitalOcean)

```bash
# 1. Create Droplet: Ubuntu 22.04 LTS, 2 vCPU, 4GB RAM, 80GB SSD
# 2. Create Managed PostgreSQL (Basic plan, 1GB RAM)
# 3. Create Managed Redis (Basic plan)
# 4. Create Cloudflare R2 bucket named "motorwa-media"

# Server initial setup:
apt update && apt upgrade -y
apt install -y nodejs npm git nginx certbot ufw fail2ban

# Firewall:
ufw allow 22 from [your IP only]
ufw allow 80
ufw allow 443
ufw enable

# Install PM2:
npm install -g pm2

# Install Node 20 via nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20 && nvm use 20
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/motorwa

# API
server {
    listen 80;
    server_name api.motorwa.rw;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50M;  # for photo uploads
    }
}

# Website (Next.js)
server {
    listen 80;
    server_name motorwa.rw www.motorwa.rw;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin
server {
    listen 80;
    server_name admin.motorwa.rw;
    
    # IP whitelist for admin
    allow [your office IP];
    allow [founder IP];
    deny all;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy-api.yml
name: Deploy API

on:
  push:
    branches: [main]
    paths: ['packages/api/**', 'packages/database/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run tests
        run: cd packages/api && npm test
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/motorwa
            git pull origin main
            cd packages/database && npx prisma migrate deploy
            cd ../api && npm install && npm run build
            pm2 restart motorwa-api
```

---

## 21. TESTING REQUIREMENTS

```
Unit Tests (Jest):
  - All service layer functions must have unit tests
  - All utility functions must have unit tests
  - Auth logic (OTP generation, JWT creation/verification)
  - Payment amount calculation logic
  - Search filter query building
  
Integration Tests (Supertest):
  - All API endpoints: happy path + error cases
  - Auth flow: full OTP → JWT → refresh flow
  - Listing creation + photo upload
  - Payment webhook handling (mock MTN/Airtel callbacks)
  
E2E Tests (Playwright — Phase 2+):
  - Register new user → post a listing → receive a message
  - Search for a car → save it → get price drop alert
  - Dealer subscription payment flow

Manual QA Checklist before each deployment:
  - Login flow on mobile browser
  - Post a listing with photos
  - Search and filter work
  - Messages send and receive
  - All forms validate correctly
  - Responsive on mobile (375px width minimum)
  - Dark mode renders correctly (mobile app)
```

---

## 22. RWANDA-SPECIFIC REQUIREMENTS

```
Phone Number Format:
  - Rwanda numbers: +250 7XX XXX XXX
  - Always store with country code: +250XXXXXXXXX
  - Validate with regex: /^\+250[0-9]{9}$/
  - Auto-prepend +250 if user enters 07XXXXXXXX

Currency Display:
  - Always primary: RWF [amount formatted with commas]
  - Always secondary: ≈ $[USD amount] (smaller, gray)
  - USD rate: fetch daily from exchange rate API, cache in Redis
  - Format: RWF 5,000,000 (not 5000000)

Timezone:
  - Server: store all times in UTC
  - Display: convert to CAT (UTC+2) for all Rwanda users
  - Use date-fns-tz for timezone conversion

Date Format:
  - Display: DD/MM/YYYY (not MM/DD/YYYY)
  - Relative: "2 days ago", "3 hours ago" (use date-fns)

Language:
  - Default: English
  - User can switch to Kinyarwanda (stored in user.language)
  - Use next-intl for i18n (Phase 1: English only, Phase 2: add Kinyarwanda)
  - All user-facing text must be in i18n strings from day 1 (even if only EN)
  
Device Testing:
  - Tecno Camon 20 (mid-range Rwanda phone)
  - Samsung Galaxy A14 (very common in Rwanda)
  - iPhone SE (smallest iPhone)
  - iPhone 14 (latest)
  - Minimum viewport: 375px wide
  - No horizontal scrolling on ANY screen size

Network:
  - Test all features on simulated 3G (Chrome DevTools throttling)
  - Images must load progressively on slow connections
  - App must handle complete offline gracefully (show cached content)
  - API timeouts: 10 seconds max before showing error state

Rwanda Provinces & Districts:
  - Kigali: Gasabo, Kicukiro, Nyarugenge
  - Northern: Burera, Gakenke, Gicumbi, Musanze, Rulindo
  - Southern: Gisagara, Huye, Kamonyi, Muhanga, Nyamagabe, Nyanza, Nyaruguru, Ruhango
  - Eastern: Bugesera, Gatsibo, Kayonza, Kirehe, Ngoma, Nyagatare, Rwamagana
  - Western: Karongi, Ngororero, Nyabihu, Nyamasheke, Rubavu, Rusizi, Rutsiro
  - Use these exactly in dropdowns
```

---

## 23. THIRD-PARTY APIS & KEYS NEEDED

> Apply for ALL of these before starting Phase 3. Some take weeks to approve.

```
1. Africa's Talking (SMS)
   URL:       africastalking.com
   Timeline:  Same day (sandbox) / 2-3 days (production)
   Required:  Email registration, Rwanda shortcode application
   Cost:      ~RWF 15-25 per SMS

2. MTN Mobile Money Collection API
   URL:       developer.mtn.com → Rwanda MoMo
   Timeline:  2-4 weeks for production approval
   Required:  Registered Rwanda business (RDB), business bank account
   Cost:      1.5-2% transaction fee + monthly fee
   ⚠️  Apply for this in Week 1 — it is the critical path

3. Airtel Money API
   URL:       developers.airtel.africa
   Timeline:  2-4 weeks for production approval
   Required:  Same as MTN
   Cost:      Similar transaction fees

4. SendGrid (Email)
   URL:       sendgrid.com
   Timeline:  Instant
   Cost:      Free tier: 100/day. $19.95/month for 50,000/month

5. Google Cloud (Maps API)
   URL:       console.cloud.google.com
   Timeline:  Instant with credit card
   Cost:      $200 free credit/month (more than enough for Rwanda scale)
   Need:      Maps JavaScript API + Places API + Geocoding API

6. Firebase (Push Notifications)
   URL:       console.firebase.google.com
   Timeline:  Instant
   Cost:      Free (Spark plan covers Rwanda scale)

7. Cloudflare R2 (File Storage)
   URL:       cloudflare.com → R2
   Timeline:  Instant with payment card
   Cost:      $0.015/GB storage, $0 egress (much cheaper than AWS S3)

8. Sentry (Error Monitoring)
   URL:       sentry.io
   Timeline:  Instant
   Cost:      Free tier covers Rwanda scale

9. DPO Group (Card Payments — optional)
   URL:       dpogroup.com
   Timeline:  1-2 weeks (Africa-focused payment processor)
   Required:  Rwanda business registration
   Note:      Use this instead of Stripe if Stripe is not available in Rwanda

10. Smile Identity (ID Verification — Phase 2)
    URL:      usesmileid.com
    Timeline: 1-2 weeks
    Cost:     Per-verification pricing
    Note:     Supports Rwanda National ID verification API
```

---

## 24. GIT WORKFLOW

```bash
# Branch naming:
main          → production only (auto-deploys)
develop       → staging/testing
feature/[name] → new features (branch from develop)
fix/[name]    → bug fixes
hotfix/[name] → urgent production fixes

# Commit message format:
feat(listings): add 5-step posting wizard
fix(auth): resolve OTP expiry check race condition
chore(deps): update Prisma to 5.8
docs(api): add payment endpoint documentation
perf(search): add Redis caching for popular queries
security(auth): increase bcrypt rounds to 12

# Pull Request rules:
- Every PR must have a description explaining what and why
- No direct pushes to main
- At least 1 review before merge (founder reviews security-related PRs)
- Tests must pass before merge
- PR must be < 400 lines changed (split into smaller PRs if larger)

# .gitignore must include (from day 1):
.env
.env.*
node_modules/
.next/
dist/
build/
*.log
.DS_Store
```

---

## 25. DEFINITION OF DONE

> A feature is DONE only when ALL of the following are true:

```
□ Code written and working locally
□ Unit/integration tests written and passing
□ No TypeScript errors (strict mode)
□ Validated with Zod on both client and server
□ Mobile responsive (tested at 375px, 768px, 1280px)
□ Loading state handled (skeleton/spinner shown)
□ Empty state handled (friendly message + action)
□ Error state handled (user-friendly message, no technical jargon)
□ Sensitive operations have rate limiting applied
□ All user input validated and sanitized
□ Feature works on Chrome, Firefox, Safari, Samsung Internet
□ Documented in API README if it's a new endpoint
□ Deployed to staging and tested by founder
□ No console.log() statements left in production code
□ Environment variables documented in .env.example
□ Committed with proper commit message format
□ PR reviewed and approved
□ Merged to develop, then to main
□ Deployed to production and manually verified
```

---

## APPENDIX — QUICK REFERENCE

### Car Makes Database (minimum to include at launch)

```
Toyota, Nissan, Honda, Mazda, Mitsubishi, Subaru, Isuzu,
Mercedes-Benz, BMW, Volkswagen, Audi, Land Rover, Range Rover,
Hyundai, Kia, Ford, Chevrolet, Suzuki, Daihatsu, Lexus,
Jeep, Peugeot, Renault, Volvo, Porsche, Infiniti, Acura,
Yamaha (bikes — Phase 2), Other
```

### Rwanda Districts (for location dropdowns)

```javascript
const RWANDA_DISTRICTS = {
  KIGALI:   ['Gasabo', 'Kicukiro', 'Nyarugenge'],
  NORTHERN: ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'],
  SOUTHERN: ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'],
  EASTERN:  ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'],
  WESTERN:  ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'],
};
```

### Key Business Rules

```
- Free listings: max 3 active at a time, 30-day expiry, 5 photos max
- Unverified users: max 2 listings in first 7 days (anti-spam)
- OTP: 6 digits, 5-minute expiry, max 3 attempts, max 5/hour per phone
- Images: min 3 per listing, max 30, max 10MB each, JPEG/PNG/WebP only
- Messages: rate limited to 100/hour per user
- Dealer subscription: auto-renews monthly, cancellation stops next renewal
- Inspection fee: platform keeps 25%, inspector gets 75%
- Phone reveal: logged per user per listing, rate limited to 10/hour
- Reviews: can only be left after conversation has happened (verified interaction)
- Price drop alert: triggered when price decreases by ≥ 5%
- Search cache TTL: 5 minutes in Redis
- Homepage cache TTL: 2 minutes in Redis
```

---

*Document version: 1.0 | Last updated: 2025 | MotorWa.rw*
*This document is confidential and intended for the development team only.*
*Do not share outside the founding team without approval.*
