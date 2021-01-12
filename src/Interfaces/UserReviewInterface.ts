import UserInterface from "./UserInterface";

export default interface UserReview {
  id: number;
  title: string;
  date: string;
  gameId: number;
  entry: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: UserInterface;
}

export interface UserReviews {
  userReviews: UserReview[];
  message: string;
}
