import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@storerating.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@12345';
  const adminName = process.env.SEED_ADMIN_NAME ?? 'System Administrator Account';
  const adminAddress =
    process.env.SEED_ADMIN_ADDRESS ??
    'Head Office, Corporate Park, Business District, Mumbai, Maharashtra, India';

  // Guard against seeding with values that would fail our own validation rules
  // (name 20-60 chars, address <=400 chars) so the seed never produces a
  // row the app itself would consider invalid.
  if (adminName.length < 20 || adminName.length > 60) {
    throw new Error('SEED_ADMIN_NAME must be between 20 and 60 characters.');
  }
  if (adminAddress.length > 400) {
    throw new Error('SEED_ADMIN_ADDRESS must be at most 400 characters.');
  }

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existingAdmin) {
    console.log(`Seed skipped: admin account already exists (${adminEmail}).`);
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const admin = await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      address: adminAddress,
      role: Role.ADMIN,
    },
  });

  console.log('Seed complete. Admin account created:');
  console.log(`  id:    ${admin.id}`);
  console.log(`  email: ${admin.email}`);
  console.log(`  role:  ${admin.role}`);
  console.log('Login with the SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD from your .env file.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
