export interface SubmitRatingPayload {
  storeId: string;
  rating: number;
}

export interface StoreRater {
  ratingId: string;
  rating: number;
  ratedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
}
