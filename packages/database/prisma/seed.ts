import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash("AdminPass123!", 10);
  const dealerPassword = await bcrypt.hash("DealerPass123!", 10);
  const userPassword = await bcrypt.hash("UserPass123!", 10);

  // Clear existing users
  await prisma.user.deleteMany();

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      passwordHash: adminPassword,
      fullName: "Admin User",
      email: "admin@motorwa.rw",
      phone: "+250788123456",
      role: "ADMIN",
      isPhoneVerified: true,
      isIdVerified: true,
    },
  });

  // Create dealer user
  const dealer = await prisma.user.create({
    data: {
      username: "dealer",
      passwordHash: dealerPassword,
      fullName: "Dealer User",
      email: "dealer@motorwa.rw",
      phone: "+250788123457",
      role: "DEALER",
      isPhoneVerified: true,
      isIdVerified: true,
      dealer: {
        create: {
          businessName: "Premium Cars Ltd",
          description: "Leading car dealership in Rwanda",
          province: "KIGALI",
          district: "Gasabo",
          address: "KG 123 Street",
          isApproved: true,
        },
      },
    },
  });

  // Create regular user
  const user = await prisma.user.create({
    data: {
      username: "user",
      passwordHash: userPassword,
      fullName: "Regular User",
      email: "user@motorwa.rw",
      phone: "+250788123458",
      role: "USER",
      isPhoneVerified: true,
    },
  });

  console.log("✅ Seed data created:");
  console.log(`Admin: username=admin, password=AdminPass123!`);
  console.log(`Dealer: username=dealer, password=DealerPass123!`);
  console.log(`User: username=user, password=UserPass123!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
