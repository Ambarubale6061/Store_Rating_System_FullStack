jest.mock('../src/config/prisma', () => ({
  prisma: {
    store: { findUnique: jest.fn() },
    rating: { upsert: jest.fn(), findMany: jest.fn(), count: jest.fn() },
    $transaction: jest.fn((queries: unknown[]) => Promise.all(queries)),
  },
}));

import { prisma } from '../src/config/prisma';
import * as ratingService from '../src/services/rating.service';

const mockedStoreFindUnique = prisma.store.findUnique as jest.Mock;
const mockedRatingUpsert = prisma.rating.upsert as jest.Mock;

describe('rating.service.submitOrUpdateRating', () => {
  it('throws not found when the store does not exist', async () => {
    mockedStoreFindUnique.mockResolvedValueOnce(null);

    await expect(ratingService.submitOrUpdateRating('user-1', 'missing-store', 5)).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(mockedRatingUpsert).not.toHaveBeenCalled();
  });

  it('upserts on the (userId, storeId) composite key so a resubmission updates, not duplicates', async () => {
    mockedStoreFindUnique.mockResolvedValueOnce({ id: 'store-1' });
    mockedRatingUpsert.mockResolvedValueOnce({ id: 'rating-1', userId: 'user-1', storeId: 'store-1', rating: 4 });

    await ratingService.submitOrUpdateRating('user-1', 'store-1', 4);

    expect(mockedRatingUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_storeId: { userId: 'user-1', storeId: 'store-1' } },
        update: { rating: 4 },
        create: { userId: 'user-1', storeId: 'store-1', rating: 4 },
      })
    );
  });
});
