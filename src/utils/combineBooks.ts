import { Book } from "../types/book";
import { BookStorage } from "../types/storage";

export default function CombineBooksFromStorage({
  storageData,
  sortFavorites,
}: {
  storageData: BookStorage;
  sortFavorites?: boolean;
}): Book[] {
  const initialList = [...storageData.online, ...storageData.local]
    .map((book) => ({
      ...book,
      favorite: storageData.favorites.includes(book.id),
    }))
    .sort((a, b) => a.id - b.id);

  if (sortFavorites) {
    const sortedFavorites = [
      ...initialList.filter((book) => book.favorite),
      ...initialList.filter((book) => !book.favorite),
    ];
    return sortedFavorites;
  }

  return initialList;
}
