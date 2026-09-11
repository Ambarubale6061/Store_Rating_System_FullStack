import { z } from 'zod';

// Mirrors the backend's validators/rules.ts exactly, so client-side errors
// match what the server would reject.
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;'])[\s\S]{8,16}$/;

export const nameSchema = z
  .string()
  .trim()
  .min(20, 'Name must be at least 20 characters.')
  .max(60, 'Name must be at most 60 characters.');

export const addressSchema = z
  .string()
  .trim()
  .min(1, 'Address is required.')
  .max(400, 'Address must be at most 400 characters.');

export const emailSchema = z.string().trim().email('Enter a valid email address.');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(16, 'Password must be at most 16 characters.')
  .regex(PASSWORD_REGEX, 'Password must include an uppercase letter and a special character.');

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
});
export type SignupFormValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required.'),
  newPassword: passwordSchema,
});
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER']),
});
export type CreateUserFormValues = z.infer<typeof createUserSchema>;

// Mirrors the backend's storeProfileFieldRules (store.validator.ts) exactly.
// categories/services are edited as a single comma-separated string in the
// form and converted to string[] on submit — see utils/storeProfile.ts.
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

export const storeProfileSchema = z.object({
  phone: z
    .string()
    .trim()
    .max(20, 'Phone number must be at most 20 characters.')
    .regex(PHONE_REGEX, 'Enter a valid phone number.')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be at most 1000 characters.')
    .optional()
    .or(z.literal('')),
  businessHours: z
    .string()
    .trim()
    .max(200, 'Business hours must be at most 200 characters.')
    .optional()
    .or(z.literal('')),
  logoUrl: z
    .string()
    .trim()
    .url('Enter a valid URL.')
    .max(500, 'Logo URL must be at most 500 characters.')
    .optional()
    .or(z.literal('')),
  categories: z.string().trim().optional().or(z.literal('')),
  services: z.string().trim().optional().or(z.literal('')),
});

export const createStoreSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    address: addressSchema,
    ownerId: z.string().uuid('Select a valid store owner.'),
  })
  .merge(storeProfileSchema);
export type CreateStoreFormValues = z.infer<typeof createStoreSchema>;

// Owner isn't editable via the store profile form (ownership changes aren't
// supported by the API), so this omits ownerId entirely.
export const updateStoreSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    address: addressSchema,
  })
  .merge(storeProfileSchema);
export type UpdateStoreFormValues = z.infer<typeof updateStoreSchema>;