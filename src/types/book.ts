export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  cover: string; // URL
  publicationDate: string; // ISO Date
  favorite?: boolean;
}

export interface BookCreate
  extends Pick<
    Book,
    "title" | "author" | "description" | "cover" | "publicationDate"
  > {}
