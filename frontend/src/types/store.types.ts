export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  createdAt: string;
  averageRating: number;
  totalRatings: number;
  myRating?: number | null;

  phone?: string | null;
  description?: string | null;
  businessHours?: string | null;
  logoUrl?: string | null;
  categories?: string[];
  services?: string[];

  owner?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface StoreProfileFieldsPayload {
  phone?: string;
  description?: string;
  businessHours?: string;
  logoUrl?: string;
  categories?: string[];
  services?: string[];
}

export interface CreateStorePayload extends StoreProfileFieldsPayload {
  name: string;
  email: string;
  address: string;
  ownerId: string;
}

export interface UpdateStorePayload extends StoreProfileFieldsPayload {
  name?: string;
  email?: string;
  address?: string;
}