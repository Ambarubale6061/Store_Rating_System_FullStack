import express from 'express';
import request from 'supertest';
import { signupValidator, loginValidator } from '../src/validators/auth.validator';
import { submitRatingValidator } from '../src/validators/rating.validator';
import { globalErrorHandler } from '../src/middlewares/errorHandler';

function buildTestApp(validators: unknown[]) {
  const app = express();
  app.use(express.json());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.post('/test', ...(validators as any), (_req: express.Request, res: express.Response) => {
    res.status(200).json({ success: true });
  });
  app.use(globalErrorHandler);
  return app;
}

const validSignupBody = {
  name: 'A Sufficiently Long Test Name', // 29 chars, within 20-60
  email: 'valid@example.com',
  password: 'Str0ng!Pass', // has uppercase + special, 11 chars
  address: '123 Main Street',
};

describe('signupValidator', () => {
  const app = buildTestApp(signupValidator);

  it('accepts a fully valid signup payload', async () => {
    const res = await request(app).post('/test').send(validSignupBody);
    expect(res.status).toBe(200);
  });

  it('rejects a name shorter than 20 characters', async () => {
    const res = await request(app).post('/test').send({ ...validSignupBody, name: 'Too Short' });
    expect(res.status).toBe(400);
  });

  it('rejects a name longer than 60 characters', async () => {
    const res = await request(app)
      .post('/test')
      .send({ ...validSignupBody, name: 'A'.repeat(61) });
    expect(res.status).toBe(400);
  });

  it('rejects an address longer than 400 characters', async () => {
    const res = await request(app)
      .post('/test')
      .send({ ...validSignupBody, address: 'A'.repeat(401) });
    expect(res.status).toBe(400);
  });

  it('rejects an invalid email', async () => {
    const res = await request(app).post('/test').send({ ...validSignupBody, email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  it('rejects a password without an uppercase letter', async () => {
    const res = await request(app).post('/test').send({ ...validSignupBody, password: 'weak!pass' });
    expect(res.status).toBe(400);
  });

  it('rejects a password without a special character', async () => {
    const res = await request(app).post('/test').send({ ...validSignupBody, password: 'NoSpecial1' });
    expect(res.status).toBe(400);
  });

  it('rejects a password shorter than 8 characters', async () => {
    const res = await request(app).post('/test').send({ ...validSignupBody, password: 'A!1abc' });
    expect(res.status).toBe(400);
  });

  it('rejects a password longer than 16 characters', async () => {
    const res = await request(app)
      .post('/test')
      .send({ ...validSignupBody, password: 'A!' + 'a'.repeat(16) });
    expect(res.status).toBe(400);
  });
});

describe('loginValidator', () => {
  const app = buildTestApp(loginValidator);

  it('accepts a valid login payload', async () => {
    const res = await request(app).post('/test').send({ email: 'user@example.com', password: 'anything' });
    expect(res.status).toBe(200);
  });

  it('rejects a missing password', async () => {
    const res = await request(app).post('/test').send({ email: 'user@example.com' });
    expect(res.status).toBe(400);
  });
});

describe('submitRatingValidator', () => {
  const app = buildTestApp(submitRatingValidator);
  const storeId = 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';

  it('accepts a rating of 1-5 with a valid storeId', async () => {
    const res = await request(app).post('/test').send({ storeId, rating: 4 });
    expect(res.status).toBe(200);
  });

  it('rejects a rating of 0', async () => {
    const res = await request(app).post('/test').send({ storeId, rating: 0 });
    expect(res.status).toBe(400);
  });

  it('rejects a rating of 6', async () => {
    const res = await request(app).post('/test').send({ storeId, rating: 6 });
    expect(res.status).toBe(400);
  });

  it('rejects a non-integer rating', async () => {
    const res = await request(app).post('/test').send({ storeId, rating: 3.5 });
    expect(res.status).toBe(400);
  });

  it('rejects a non-UUID storeId', async () => {
    const res = await request(app).post('/test').send({ storeId: 'not-a-uuid', rating: 3 });
    expect(res.status).toBe(400);
  });
});
