import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import xssClean from 'xss-clean';
import 'express-async-errors';

import { env } from './config/env';
import { AppError } from './utils/AppError';
import { globalErrorHandler, notFoundHandler } from './middlewares/errorHandler';
import { sendSuccess } from './utils/ApiResponse';
import apiRoutes from './routes';

export function createApp(): Application {
  const app = express();

  // Render / Cloud Hosting साठी trust proxy 1 सेट करणे आवश्यक आहे
  if (env.isProduction) {
    app.set('trust proxy', 1);
  } else {
    app.set('trust proxy', env.trustProxyHops || 1);
  }

  // --- Security middleware ---
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);

        if (env.clientUrls.includes(origin)) {
          return callback(null, true);
        }

        callback(AppError.forbidden(`Origin "${origin}" is not allowed by CORS policy.`));
      },
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
      allowedOrigins: env.clientUrls,
    });
  });

  // --- Feature routes ---
  app.use('/api', apiRoutes);

  // --- 404 + global error handler (must be last) ---
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
}