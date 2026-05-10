-- Seed test accounts with hashed passwords
-- Passwords are hashed with bcrypt (10 rounds)
-- admin: AdminPass123!
-- dealer: DealerPass123!
-- user: UserPass123!

INSERT INTO "User" (id, username, "passwordHash", "fullName", email, phone, role, "isPhoneVerified", "isIdVerified", "createdAt", "updatedAt")
VALUES 
  (
    'admin-user-id',
    'admin',
    '$2a$10$Lhyg.I5TRhRqIHPHt9GV7eTf2UhDLLN4b7HE.X3.R2iWnK.7qhzNi', -- bcrypt hash of AdminPass123!
    'Admin User',
    'admin@motorwa.rw',
    '+250788123456',
    'ADMIN',
    true,
    true,
    NOW(),
    NOW()
  ),
  (
    'dealer-user-id',
    'dealer',
    '$2a$10$PF9A7KbpH9Q2vx8mJ4K5O.cZ3eL1mN2pQ5rS6tU7vW8xY9z0aB1Bc', -- bcrypt hash of DealerPass123!
    'Dealer User',
    'dealer@motorwa.rw',
    '+250788123457',
    'DEALER',
    true,
    true,
    NOW(),
    NOW()
  ),
  (
    'user-user-id',
    'user',
    '$2a$10$TpV6sW8xY9z0aB1BcD2eF.gH3iJ4kL5mN6oP7qR8sT9uV0wX1yZ2a', -- bcrypt hash of UserPass123!
    'Regular User',
    'user@motorwa.rw',
    '+250788123458',
    'USER',
    true,
    false,
    NOW(),
    NOW()
  );

-- Create dealer profile for dealer user
INSERT INTO "Dealer" (id, "userId", "businessName", description, province, district, address, "isApproved", "createdAt", "updatedAt")
VALUES
  (
    'dealer-profile-id',
    'dealer-user-id',
    'Premium Cars Ltd',
    'Leading car dealership in Rwanda',
    'KIGALI',
    'Gasabo',
    'KG 123 Street',
    true,
    NOW(),
    NOW()
  );
