import { Role, User } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  address: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

function toTokenPayload(user: Pick<User, 'id' | 'email' | 'role'>): TokenPayload {
  return { sub: user.id, email: user.email, role: user.role };
}

function toSafeUser(user: User) {
  const { password: _password, ...safe } = user;
  return safe;
}

function issueTokens(user: Pick<User, 'id' | 'email' | 'role'>): AuthTokens {
  const payload = toTokenPayload(user);
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export async function signup(input: SignupInput) {
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
      role: Role.USER, // Public signup always creates a plain USER account.
    },
  });

  const tokens = issueTokens(user);
  return { user: toSafeUser(user), ...tokens };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw AppError.unauthorized('Invalid email or password.');
  }

  const passwordMatches = await comparePassword(password, user.password);
  if (!passwordMatches) {
    throw AppError.unauthorized('Invalid email or password.');
  }

  const tokens = issueTokens(user);
  return { user: toSafeUser(user), ...tokens };
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  let payload: TokenPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw AppError.unauthorized('Invalid or expired refresh token.');
  }

  // Re-check the user still exists (and hasn't changed role) before minting
  // a new access token, rather than trusting the stale token payload.
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw AppError.unauthorized('User no longer exists.');
  }

  return issueTokens(user);
}

export async function changePassword(userId: string, oldPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw AppError.notFound('User not found.');
  }

  const matches = await comparePassword(oldPassword, user.password);
  if (!matches) {
    throw AppError.badRequest('Current password is incorrect.');
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw AppError.notFound('User not found.');
  }
  return toSafeUser(user);
}
