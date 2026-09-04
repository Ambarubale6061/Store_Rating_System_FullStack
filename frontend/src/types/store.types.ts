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
}

export interface CreateStorePayload {
  name: string;
  email: string;
  address: string;
  ownerId: string;
}
