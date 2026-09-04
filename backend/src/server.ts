import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

const server = app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Store Rating System API running on port ${env.port} [${env.nodeEnv}]`);
});

// Graceful shutdown on unexpected rejections
process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('UNHANDLED REJECTION! Shutting down...', reason);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM received. Shutting down gracefully.');
  server.close(() => process.exit(0));
});
