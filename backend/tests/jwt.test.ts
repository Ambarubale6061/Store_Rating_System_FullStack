import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../src/utils/jwt';
import { Role } from '@prisma/client';

const payload = { sub: 'user-123', email: 'test@example.com', role: Role.USER };

describe('jwt utils', () => {
  it('signs and verifies an access token with the correct payload', () => {
    const token = signAccessToken(payload);
    const decoded = verifyAccessToken(token);

    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('signs and verifies a refresh token with the correct payload', () => {
    const token = signRefreshToken(payload);
    const decoded = verifyRefreshToken(token);
    expect(decoded.sub).toBe(payload.sub);
  });

  it('rejects an access token verified with the refresh verifier', () => {
    const token = signAccessToken(payload);
    expect(() => verifyRefreshToken(token)).toThrow();
  });

  it('rejects a tampered token', () => {
    const token = signAccessToken(payload);
    const tampered = token.slice(0, -2) + 'xx';
    expect(() => verifyAccessToken(tampered)).toThrow();
  });
});
