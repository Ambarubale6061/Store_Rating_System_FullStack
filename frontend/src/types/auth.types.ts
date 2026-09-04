export type Role = 'ADMIN' | 'USER' | 'STORE_OWNER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  address: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  address: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
