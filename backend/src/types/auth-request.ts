import { Request } from 'express';
import { Role } from '@prisma/client';

/**
 * Request shape after the `authenticate` middleware has run. Used instead
 * of augmenting the global Express.Request type, since that approach
 * depends on ts-node discovering an ambient .d.ts file that isn't reached
 * through normal module imports — unreliable across environments. This
 * interface is a regular, explicitly-imported type instead.
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}