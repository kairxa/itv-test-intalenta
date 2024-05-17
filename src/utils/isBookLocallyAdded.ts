import { BOOK_LOCAL_MIN_STARTING_ID } from "../constants";
import { Book } from "../types/book";

export default function (book: Book): boolean {
  return book.id >= BOOK_LOCAL_MIN_STARTING_ID;
}
