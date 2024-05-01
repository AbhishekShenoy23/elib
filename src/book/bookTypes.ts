import { User } from "../user/userTypes";

export interface Book {
  _id: string;
  title: string;
  coverImage: string;
  file: string;
  author: User;
  genre: string;
  createdAt: Date;
  updatedAt: Date;
}
