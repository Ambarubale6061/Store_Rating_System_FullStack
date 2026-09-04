import { Role } from '@prisma/client';

jest.mock('../src/config/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { prisma } from '../src/config/prisma';
import * as authService from '../src/services/auth.service';
import { hashPassword } from '../src/utils/password';

const mockedUserFindUnique = prisma.user.findUnique as jest.Mock;
const mockedUserCreate = prisma.user.create as jest.Mock;

describe('auth.service.signup', () => {
  it('throws a conflict error when the email is already registered', async () => {
    mockedUserFindUnique.mockResolvedValueOnce({ id: 'existing-user' });

    await expect(
      authService.signup({
        name: 'A Sufficiently Long Test Name',
        email: 'taken@example.com',
        password: 'Str0ng!Pass',
        address: '123 Main Street',
      })
    ).rejects.toMatchObject({ statusCode: 409 });

    expect(mockedUserCreate).not.toHaveBeenCalled();
  });

  it('creates a new USER-role account when the email is free', async () => {
    mockedUserFindUnique.mockResolvedValueOnce(null);
    mockedUserCreate.mockResolvedValueOnce({
      id: 'new-user',
      name: 'A Sufficiently Long Test Name',
      email: 'new@example.com',
      password: 'hashed',
      address: '123 Main Street',
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await authService.signup({
      name: 'A Sufficiently Long Test Name',
      email: 'new@example.com',
      password: 'Str0ng!Pass',
      address: '123 Main Street',
    });

    expect(mockedUserCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ role: Role.USER }) })
    );
    expect(result.user).not.toHaveProperty('password');
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });
});

describe('auth.service.login', () => {
  it('throws unauthorized for a non-existent email', async () => {
    mockedUserFindUnique.mockResolvedValueOnce(null);
    await expect(authService.login('ghost@example.com', 'whatever')).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('throws unauthorized for an incorrect password', async () => {
    const hashed = await hashPassword('Correct!123');
    mockedUserFindUnique.mockResolvedValueOnce({
      id: 'u1',
      email: 'user@example.com',
      password: hashed,
      role: Role.USER,
    });

    await expect(authService.login('user@example.com', 'Wrong!123')).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('returns tokens for a correct password', async () => {
    const hashed = await hashPassword('Correct!123');
    mockedUserFindUnique.mockResolvedValueOnce({
      id: 'u1',
      name: 'A Sufficiently Long Test Name',
      email: 'user@example.com',
      password: hashed,
      address: 'Addr',
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await authService.login('user@example.com', 'Correct!123');
    expect(result.accessToken).toBeDefined();
    expect(result.user.email).toBe('user@example.com');
  });
});

describe('auth.service.changePassword', () => {
  it('rejects when the old password is wrong', async () => {
    const hashed = await hashPassword('Correct!123');
    mockedUserFindUnique.mockResolvedValueOnce({ id: 'u1', password: hashed });

    await expect(authService.changePassword('u1', 'Wrong!123', 'New!12345')).rejects.toMatchObject({
      statusCode: 400,
    });
  });
});
