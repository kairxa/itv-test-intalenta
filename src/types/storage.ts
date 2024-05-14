import { Book } from "./book";

export interface BookStorage {
  online: Book[];
  local: Book[];
  favorites: number[]; // book IDs
  updatedAt: string; // ISO Date
  ttl: number; // ms
}

export type BookDataSource = "online" | "local";

export interface StorageMethods {
  Put: (dataSource: BookDataSource, books: Book[]) => void;
  Delete: (id: number) => void; // only local
  Get: () => BookStorage;
  ToggleFavorite: (id: number) => void;
  SetTTL: (ttl: number) => void;
  SetUpdatedAt: (updatedAt: string) => void;
}
