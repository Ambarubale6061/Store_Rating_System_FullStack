import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: requireEnv('NODE_ENV', 'development'),
  port: parseInt(requireEnv('PORT', '5000'), 10),
  clientUrl: requireEnv('CLIENT_URL', 'http://localhost:5173'),

  databaseUrl: requireEnv('DATABASE_URL', ''),

  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET', 'dev_access_secret_change_me'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me'),
    accessExpiresIn: requireEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: requireEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  bcryptSaltRounds: parseInt(requireEnv('BCRYPT_SALT_ROUNDS', '10'), 10),

  rateLimit: {
    windowMs: parseInt(requireEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    max: parseInt(requireEnv('RATE_LIMIT_MAX', '200'), 10),
  },

  isProduction: requireEnv('NODE_ENV', 'development') === 'production',
};
