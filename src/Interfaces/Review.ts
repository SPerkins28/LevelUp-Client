import UserInterface from './UserInterface';

export default interface Review {
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
