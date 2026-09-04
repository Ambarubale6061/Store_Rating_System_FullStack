import { Prisma, Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { hashPassword } from '../utils/password';
import { ParsedPagination } from '../utils/pagination';
import { getStoreRatingStats } from './store.service';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  address: string;
  role?: Role;
}

export interface ListUsersOptions extends ParsedPagination {
  search?: string;
  role?: Role;
}

function toSafeUser<T extends { password: string }>(user: T) {
  const { password: _password, ...safe } = user;
  return safe;
}

export async function createUser(input: CreateUserInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw AppError.conflict('An account with this email already exists.');
  }

  const hashed = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashed,
      address: input.address,
      role: input.role ?? Role.USER,
    },
  });

  return toSafeUser(user);
}

export async function listUsers(options: ListUsersOptions) {
  const { skip, take, sortBy, sortOrder, search, role } = options;

  const where: Prisma.UserWhereInput = {
    ...(role ? { role } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({ where, skip, take, orderBy: { [sortBy]: sortOrder } }),
    prisma.user.count({ where }),
  ]);

  return { users: users.map(toSafeUser), total };
}

/**
 * User detail view. If the user is a STORE_OWNER, also attaches their
 * store(s) with computed average rating, per the admin "View User Details"
 * requirement ("If Store Owner, show Store Average Rating").
 */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw AppError.notFound('User not found.');
  }

  const safeUser = toSafeUser(user);

  if (user.role !== Role.STORE_OWNER) {
    return { ...safeUser, stores: [] as unknown[] };
  }

  const stores = await prisma.store.findMany({ where: { ownerId: user.id } });
  const storesWithStats = await Promise.all(
    stores.map(async (store) => ({
      ...store,
      ...(await getStoreRatingStats(store.id)),
    }))
  );

  return { ...safeUser, stores: storesWithStats };
}
