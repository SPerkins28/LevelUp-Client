import UserInterface from "./UserInterface";

export default interface UserWantToPlayGame {
  id: number;
  title: string;
  gameId: number;
  gameImg: string;
  releaseDate: string;
  played: boolean;
  uniqueCheck: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: UserInterface;
}
export interface UserWantToPlay {
  userWantToPlay: UserWantToPlayGame[];
  message: string;
}
