import { hashPassword, comparePassword } from '../src/utils/password';

describe('password utils', () => {
  it('hashes a password and can verify it against the same plaintext', async () => {
    const plain = 'Str0ng!Pass';
    const hashed = await hashPassword(plain);

    expect(hashed).not.toBe(plain);
    await expect(comparePassword(plain, hashed)).resolves.toBe(true);
  });

  it('rejects an incorrect password against a valid hash', async () => {
    const hashed = await hashPassword('Correct!123');
    await expect(comparePassword('Wrong!123', hashed)).resolves.toBe(false);
  });

  it('produces a different hash each time (random salt)', async () => {
    const a = await hashPassword('SamePass!1');
    const b = await hashPassword('SamePass!1');
    expect(a).not.toBe(b);
  });
});
