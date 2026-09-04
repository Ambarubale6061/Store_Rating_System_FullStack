import { Prisma, Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { ParsedPagination } from '../utils/pagination';

export interface CreateStoreInput {
  name: string;
  email: string;
  address: string;
  ownerId: string;
}

export interface ListStoresOptions extends ParsedPagination {
  search?: string;
  currentUserId?: string; // when set, attaches "myRating" for that user
}

async function assertOwnerIsStoreOwner(ownerId: string) {
  const owner = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!owner) {
    throw AppError.badRequest('The specified owner does not exist.');
  }
  if (owner.role !== Role.STORE_OWNER) {
    throw AppError.badRequest('The specified owner must have the STORE_OWNER role.');
  }
}

export async function createStore(input: CreateStoreInput) {
  await assertOwnerIsStoreOwner(input.ownerId);

  const existingEmail = await prisma.store.findUnique({ where: { email: input.email } });
  if (existingEmail) {
    throw AppError.conflict('A store with this email already exists.');
  }

  return prisma.store.create({ data: { ...input } });
}

/**
 * Computes average rating + rating count for a store using a single
 * aggregate query rather than loading every rating row into memory.
 */
export async function getStoreRatingStats(storeId: string) {
  const result = await prisma.rating.aggregate({
    where: { storeId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  return {
    averageRating: result._avg.rating ? Number(result._avg.rating.toFixed(2)) : 0,
    totalRatings: result._count.rating,
  };
}

export async function listStores(options: ListStoresOptions) {
  const { skip, take, sortBy, sortOrder, search, currentUserId } = options;

  const where: Prisma.StoreWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  // averageRating is a computed field, not a real column, so it can't be
  // sorted at the database level without a raw query — we sort by createdAt
  // at the DB level for that case and re-sort in memory after aggregating.
  const dbSortBy = sortBy === 'averageRating' ? 'createdAt' : sortBy;

  const [stores, total] = await prisma.$transaction([
    prisma.store.findMany({
      where,
      skip,
      take,
      orderBy: { [dbSortBy]: sortOrder },
    }),
    prisma.store.count({ where }),
  ]);

  // If browsing as a USER, fetch that user's ratings for just these stores
  // in one extra query, rather than a conditional Prisma `include` (which
  // types awkwardly when it's toggled on/off based on a runtime value).
  const myRatingsByStoreId = new Map<string, number>();
  if (currentUserId && stores.length > 0) {
    const myRatings = await prisma.rating.findMany({
      where: { userId: currentUserId, storeId: { in: stores.map((s) => s.id) } },
      select: { storeId: true, rating: true },
    });
    for (const r of myRatings) {
      myRatingsByStoreId.set(r.storeId, r.rating);
    }
  }

  const withStats = await Promise.all(
    stores.map(async (store) => {
      const stats = await getStoreRatingStats(store.id);
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
        createdAt: store.createdAt,
        averageRating: stats.averageRating,
        totalRatings: stats.totalRatings,
        myRating: currentUserId ? myRatingsByStoreId.get(store.id) ?? null : undefined,
      };
    })
  );

  if (sortBy === 'averageRating') {
    withStats.sort((a, b) => (sortOrder === 'asc' ? a.averageRating - b.averageRating : b.averageRating - a.averageRating));
  }

  return { stores: withStats, total };
}

export async function getStoreById(storeId: string) {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: { owner: { select: { id: true, name: true, email: true } } },
  });
  if (!store) {
    throw AppError.notFound('Store not found.');
  }
  const stats = await getStoreRatingStats(storeId);
  return { ...store, ...stats };
}