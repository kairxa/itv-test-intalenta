import { Book } from "./book";

export interface BookStorage {
  online: Book[];
  local: Book[];
  favorites: string[]; // book IDs
  updatedAt: string; // ISO Date
  ttl: number; // ms
}

export type BookDataSource = "online" | "local";

export interface StorageMethods {
  Put: (dataSource: BookDataSource, books: Book[]) => void;
  Delete: (id: string) => void; // only local
  Get: () => BookStorage;
  ToggleFavorite: (id: string) => void;
  SetTTL: (ttl: number) => void;
}
