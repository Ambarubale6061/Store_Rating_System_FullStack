import type { Role } from "@prisma/client";

declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: Role;
    };
  }
}

export {};