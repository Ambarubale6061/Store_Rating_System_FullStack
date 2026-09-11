import type { StoreProfileFieldsPayload } from '@/types/store.types';

export function listToCommaString(items?: string[]): string {
  return items && items.length > 0 ? items.join(', ') : '';
}

export function commaStringToList(value?: string): string[] | undefined {
  if (!value) return undefined;
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

export interface StoreProfileFormFields {
  phone?: string;
  description?: string;
  businessHours?: string;
  logoUrl?: string;
  categories?: string;
  services?: string;
}

export function toStoreProfilePayload(values: StoreProfileFormFields): StoreProfileFieldsPayload {
  return {
    phone: values.phone?.trim() || undefined,
    description: values.description?.trim() || undefined,
    businessHours: values.businessHours?.trim() || undefined,
    logoUrl: values.logoUrl?.trim() || undefined,
    categories: commaStringToList(values.categories),
    services: commaStringToList(values.services),
  };
}