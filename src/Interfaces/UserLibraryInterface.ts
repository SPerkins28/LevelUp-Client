import UserInterface from "./UserInterface";

export default interface UserLibraryGame {
  id: number;
  title: string;
  gameId: number;
  gameImg: string;
  releaseDate: string;
  finished: boolean;
  uniqueCheck: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: UserInterface;
}

export interface UserLibrary {
  userLibrary: UserLibraryGame[];
  message: string;
}
