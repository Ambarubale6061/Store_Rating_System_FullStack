import type { Role, AuthUser } from './auth.types';

export interface AdminUser extends AuthUser {
  stores?: StoreWithStats[];
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  address: string;
  role: Role;
}

export interface StoreWithStats {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  averageRating: number;
  totalRatings: number;
}
