import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { getStoreRatingStats } from './store.service';

export async function getAdminDashboardStats() {
  const [totalUsers, totalStores, totalRatings] = await prisma.$transaction([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);

  return { totalUsers, totalStores, totalRatings };
}

/**
 * Store Owner dashboard: aggregates across all stores they own (a store
 * owner may own more than one store, per the schema design).
 */
export async function getStoreOwnerDashboardStats(ownerId: string) {
  const stores = await prisma.store.findMany({ where: { ownerId } });
  if (stores.length === 0) {
    throw AppError.notFound('No store found for this account.');
  }

  const storesWithStats = await Promise.all(
    stores.map(async (store) => ({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      ...(await getStoreRatingStats(store.id)),
    }))
  );

  const totalRatings = storesWithStats.reduce((sum, s) => sum + s.totalRatings, 0);
  const weightedAverage =
    totalRatings === 0
      ? 0
      : Number(
          (
            storesWithStats.reduce((sum, s) => sum + s.averageRating * s.totalRatings, 0) / totalRatings
          ).toFixed(2)
        );

  return { stores: storesWithStats, totalRatings, averageRating: weightedAverage };
}
