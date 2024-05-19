import { BASE_API_URL, BOOK_LOCAL_MIN_STARTING_ID } from "../constants";
import { Book, BookCreate } from "../types/book";
import { BookStorage } from "../types/storage";
import CombineBooksFromStorage from "../utils/combineBooks";
import LocalStorage from "../utils/storage/localStorage";

const getBookListOnline = async (): Promise<Book[]> => {
  const response = await fetch(BASE_API_URL);
  const books: Book[] = await response.json();
  return books;
};

const getBookListOffline = (): [BookStorage, boolean] => {
  const localStorageData = LocalStorage.Get();
  const currentTime = new Date();
  const updateTTLTime = new Date(
    new Date(localStorageData.updatedAt).getTime() + localStorageData.ttl,
  );
  const shouldUpdateOnlineList = currentTime > updateTTLTime;

  return [localStorageData, shouldUpdateOnlineList];
};

export const BookListGet = async ({
  showFavoritesFirst = false,
}: {
  showFavoritesFirst?: boolean;
}): Promise<Book[]> => {
  const [localStorageData, shouldUpdateOnlineList] = getBookListOffline();

  if (!shouldUpdateOnlineList) {
    return CombineBooksFromStorage({
      storageData: localStorageData,
      sortFavorites: showFavoritesFirst,
    });
  }

  const currentTime = new Date();
  const newOnlineData = await getBookListOnline();
  localStorageData.online = newOnlineData;
  localStorageData.updatedAt = currentTime.toISOString();
  LocalStorage.Put("online", newOnlineData);
  LocalStorage.SetUpdatedAt(currentTime.toISOString());

  return CombineBooksFromStorage({
    storageData: localStorageData,
    sortFavorites: showFavoritesFirst,
  });
};

export const BookGetByID = async (id: number): Promise<Book> => {
  // Decided not to use the mentioned get by ID route, since our source of truth
  // is now the data inside localStorage, not the data from list API.
  // We still need to consider the locally stored books data anyway everytime we requested
  // book by ID, so we better do BookListGet everytime we do BookGetByID

  const bookList = await BookListGet({});

  return bookList.find((book) => book.id === id) || ({} as Book);
};

export const BookAdd = (book: BookCreate) => {
  const localStorageData = LocalStorage.Get();
  const localBooks = structuredClone(localStorageData.local).sort(
    (bookA, bookB) => bookA.id - bookB.id,
  );

  let id = BOOK_LOCAL_MIN_STARTING_ID; // arbitrary starting ID, not for production but fits for this test
  if (localBooks.length > 0) id = localBooks[localBooks.length - 1].id + 1; // auto-increment yay

  localBooks.push({
    ...book,
    id,
  });

  LocalStorage.Put("local", localBooks);
};

export const BookDelete = (id: number) => {
  LocalStorage.Delete(id);
};

export const BookUpdate = (updatedBook: Book) => {
  const localStorageData = LocalStorage.Get();
  const localBooks = structuredClone(localStorageData.local);

  // Not found ID will just simply not updating the array of localBooks
  const updatedBooks = localBooks.map((book) => {
    if (book.id === updatedBook.id) {
      return updatedBook;
    }

    return book;
  });

  LocalStorage.Put("local", updatedBooks);
};

export const BookFavorite = (id: number) => {
  const favorites = LocalStorage.GetFavorites();
  const favoriteIdx = favorites.indexOf(id);

  if (favoriteIdx === -1) {
    favorites.push(id);
  } else {
    favorites.splice(favoriteIdx, 1);
  }

  LocalStorage.SetFavorites(favorites);
};
