import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { ParsedPagination } from '../utils/pagination';

/**
 * Creates a rating, or updates the existing one, for (userId, storeId).
 * Uses Prisma's upsert against the composite unique constraint so this is
 * a single atomic operation rather than a manual find-then-create/update.
 */
export async function submitOrUpdateRating(userId: string, storeId: string, rating: number) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    throw AppError.notFound('Store not found.');
  }

  return prisma.rating.upsert({
    where: { userId_storeId: { userId, storeId } },
    update: { rating },
    create: { userId, storeId, rating },
  });
}

export async function getMyRatingForStore(userId: string, storeId: string) {
  return prisma.rating.findUnique({ where: { userId_storeId: { userId, storeId } } });
}

/**
 * List of users who rated a given store, with their rating — used by the
 * Store Owner dashboard.
 */
export async function listRatersForStore(storeId: string, pagination: ParsedPagination) {
  const { skip, take, sortOrder } = pagination;

  const [ratings, total] = await prisma.$transaction([
    prisma.rating.findMany({
      where: { storeId },
      skip,
      take,
      orderBy: { createdAt: sortOrder },
      include: { user: { select: { id: true, name: true, email: true, address: true } } },
    }),
    prisma.rating.count({ where: { storeId } }),
  ]);

  return {
    raters: ratings.map((r) => ({
      ratingId: r.id,
      rating: r.rating,
      ratedAt: r.createdAt,
      user: r.user,
    })),
    total,
  };
}

export async function assertUserOwnsStore(userId: string, storeId: string) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    throw AppError.notFound('Store not found.');
  }
  if (store.ownerId !== userId) {
    throw AppError.forbidden('You do not own this store.');
  }
  return store;
}