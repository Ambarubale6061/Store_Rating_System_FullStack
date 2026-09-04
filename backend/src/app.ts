import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import xssClean from 'xss-clean';
import 'express-async-errors';

import { env } from './config/env';
import { globalErrorHandler, notFoundHandler } from './middlewares/errorHandler';
import { sendSuccess } from './utils/ApiResponse';
import apiRoutes from './routes';

export function createApp(): Application {
  const app = express();

  // --- Security middleware ---
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );
  app.use(
    rateLimit({
      windowMs: env.rateLimit.windowMs,
      max: env.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests, please try again later.' },
    })
  );

  // --- Body parsing & sanitization ---
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(xssClean());

  // --- Logging ---
  if (!env.isProduction) {
    app.use(morgan('dev'));
  }

  // --- Health check ---
  app.get('/api/health', (_req, res) => {
    sendSuccess(res, 200, 'Store Rating System API is healthy', {
      timestamp: new Date().toISOString(),
      environment: env.nodeEnv,
    });
  });

  // --- Feature routes ---
  app.use('/api', apiRoutes);

  // --- 404 + global error handler (must be last) ---
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
}