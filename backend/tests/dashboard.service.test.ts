jest.mock('../src/config/prisma', () => ({
  prisma: {
    user: { count: jest.fn() },
    store: { count: jest.fn(), findMany: jest.fn() },
    rating: { count: jest.fn(), aggregate: jest.fn() },
    $transaction: jest.fn((queries: unknown[]) => Promise.all(queries)),
  },
}));

import { prisma } from '../src/config/prisma';
import * as dashboardService from '../src/services/dashboard.service';

describe('dashboard.service.getAdminDashboardStats', () => {
  it('returns totals for users, stores, and ratings', async () => {
    (prisma.user.count as jest.Mock).mockResolvedValueOnce(12);
    (prisma.store.count as jest.Mock).mockResolvedValueOnce(5);
    (prisma.rating.count as jest.Mock).mockResolvedValueOnce(37);

    const stats = await dashboardService.getAdminDashboardStats();

    expect(stats).toEqual({ totalUsers: 12, totalStores: 5, totalRatings: 37 });
  });
});

describe('dashboard.service.getStoreOwnerDashboardStats', () => {
  it('throws not found when the owner has no stores', async () => {
    (prisma.store.findMany as jest.Mock).mockResolvedValueOnce([]);

    await expect(dashboardService.getStoreOwnerDashboardStats('owner-1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('computes a ratings-weighted average across multiple owned stores', async () => {
    (prisma.store.findMany as jest.Mock).mockResolvedValueOnce([
      { id: 's1', name: 'Store 1', email: 's1@x.com', address: 'A1' },
      { id: 's2', name: 'Store 2', email: 's2@x.com', address: 'A2' },
    ]);
    // Store 1: avg 5.0 over 2 ratings. Store 2: avg 2.0 over 8 ratings.
    // Weighted average = (5*2 + 2*8) / 10 = 2.6
    (prisma.rating.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _avg: { rating: 5.0 }, _count: { rating: 2 } })
      .mockResolvedValueOnce({ _avg: { rating: 2.0 }, _count: { rating: 8 } });

    const result = await dashboardService.getStoreOwnerDashboardStats('owner-1');

    expect(result.totalRatings).toBe(10);
    expect(result.averageRating).toBe(2.6);
  });
});
