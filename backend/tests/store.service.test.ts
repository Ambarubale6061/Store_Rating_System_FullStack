jest.mock('../src/config/prisma', () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    store: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn() },
    rating: { findMany: jest.fn(), aggregate: jest.fn() },
    $transaction: jest.fn((queries: unknown[]) => Promise.all(queries)),
  },
}));

import { prisma } from '../src/config/prisma';
import * as storeService from '../src/services/store.service';

const mockedStoreFindUnique = prisma.store.findUnique as jest.Mock;
const mockedStoreUpdate = prisma.store.update as jest.Mock;
const mockedRatingAggregate = prisma.rating.aggregate as jest.Mock;

describe('store.service.updateStore', () => {
  it('throws not found when the store does not exist', async () => {
    mockedStoreFindUnique.mockResolvedValueOnce(null);

    await expect(storeService.updateStore('missing-store', { phone: '+1-555-0100' })).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(mockedStoreUpdate).not.toHaveBeenCalled();
  });

  it('throws conflict when updating to an email already used by another store', async () => {
    mockedStoreFindUnique
      .mockResolvedValueOnce({ id: 'store-1', email: 'old@example.com' }) // existing store lookup
      .mockResolvedValueOnce({ id: 'store-2', email: 'taken@example.com' }); // email-taken check

    await expect(storeService.updateStore('store-1', { email: 'taken@example.com' })).rejects.toMatchObject({
      statusCode: 409,
    });
    expect(mockedStoreUpdate).not.toHaveBeenCalled();
  });

  it('allows updating profile fields and returns the fully-hydrated store', async () => {
    mockedStoreFindUnique
      .mockResolvedValueOnce({ id: 'store-1', email: 'store@example.com' }) // existing store lookup
      .mockResolvedValueOnce({
        // getStoreById's internal findUnique (post-update re-fetch)
        id: 'store-1',
        name: 'Store One',
        email: 'store@example.com',
        address: 'Addr',
        ownerId: 'owner-1',
        phone: '+1-555-0100',
        description: 'A great place.',
        businessHours: 'Mon-Fri 9-5',
        logoUrl: 'https://example.com/logo.png',
        categories: ['Bakery'],
        services: ['Custom Cakes'],
        owner: { id: 'owner-1', name: 'Owner Name', email: 'owner@example.com' },
      });
    mockedRatingAggregate.mockResolvedValueOnce({ _avg: { rating: 4.5 }, _count: { rating: 2 } });

    const result = await storeService.updateStore('store-1', {
      phone: '+1-555-0100',
      description: 'A great place.',
      categories: ['Bakery'],
      services: ['Custom Cakes'],
    });

    expect(mockedStoreUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'store-1' },
        data: expect.objectContaining({ phone: '+1-555-0100', categories: ['Bakery'] }),
      })
    );
    expect(result.phone).toBe('+1-555-0100');
    expect(result.averageRating).toBe(4.5);
    expect((result as unknown as { owner: { name: string } }).owner.name).toBe('Owner Name');
  });
});