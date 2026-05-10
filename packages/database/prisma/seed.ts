import { PrismaClient, UserRole, Province } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('Admin@123', 12);

  // ─── ADMIN USER ──────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
      fullName: 'System Administrator',
      phone: '+250780000001',
      email: 'admin@motorwa.rw',
      role: 'ADMIN',
      isPhoneVerified: true,
      isIdVerified: true,
      province: 'KIGALI',
      district: 'Nyarugenge',
      language: 'en',
    },
  });
  console.log(`  ✓ Admin user: "admin" / "Admin@123"`);

  // ─── DEALER USER ─────────────────────────────────
  const dealerPassword = await bcrypt.hash('Dealer@123', 12);
  const dealer = await prisma.user.upsert({
    where: { username: 'dealer' },
    update: {},
    create: {
      username: 'dealer',
      passwordHash: dealerPassword,
      fullName: 'Jean Baptiste Garage',
      phone: '+250780000002',
      email: 'dealer@motorwa.rw',
      role: 'DEALER',
      isPhoneVerified: true,
      isIdVerified: true,
      province: 'KIGALI',
      district: 'Gasabo',
      language: 'en',
    },
  });
  console.log(`  ✓ Dealer user: "dealer" / "Dealer@123"`);

  // Dealer profile
  await prisma.dealer.upsert({
    where: { userId: dealer.id },
    update: {},
    create: {
      userId: dealer.id,
      businessName: 'JB Motors Ltd',
      description: 'Trusted car dealer in Kigali with over 10 years of experience.',
      district: 'Gasabo',
      province: 'KIGALI',
      address: 'KG 123 St, Kigali',
      subscriptionPlan: 'monthly',
      subscriptionStart: new Date(),
      subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isApproved: true,
      teamLimit: 10,
    },
  });
  console.log('  ✓ Dealer profile created');

  // ─── REGULAR USER ────────────────────────────────
  const userPassword = await bcrypt.hash('User@123', 12);
  const regularUser = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      passwordHash: userPassword,
      fullName: 'Alice Mukamana',
      phone: '+250780000003',
      email: 'alice@example.com',
      role: 'USER',
      isPhoneVerified: true,
      isIdVerified: false,
      province: 'SOUTHERN',
      district: 'Huye',
      language: 'rw',
    },
  });
  console.log(`  ✓ Regular user: "user" / "User@123"`);

  console.log('\n✅ Seeding complete!');
  console.log('\nCredentials:');
  console.log('  Admin  → username: "admin"  password: "Admin@123"');
  console.log('  Dealer → username: "dealer" password: "Dealer@123"');
  console.log('  User   → username: "user"   password: "User@123"');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
