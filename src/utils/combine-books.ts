import { Book } from "../types/book";
import { BookStorage } from "../types/storage";

export default function CombineBooksFromStorage(
  storageData: BookStorage,
): Book[] {
  const initialList = [...storageData.online, ...storageData.local].map(
    (book) => ({
      ...book,
      favorite: storageData.favorites.includes(book.id),
    }),
  );
  const sortedFavorites = [
    ...initialList.filter((book) => book.favorite),
    ...initialList.filter((book) => !book.favorite),
  ];
  return sortedFavorites;
}
