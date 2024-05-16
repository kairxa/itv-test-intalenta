import { BASE_API_URL } from "../constants";
import { Book, BookCreate } from "../types/book";
import CombineBooksFromStorage from "../utils/combine-books";
import LocalStorage from "../utils/storage/localStorage";

const getBookListOnline = async (): Promise<Book[]> => {
  const response = await fetch(BASE_API_URL);
  const books: Book[] = await response.json();
  return books;
};

export const BookListGet = async (): Promise<Book[]> => {
  const localStorageData = LocalStorage.Get();
  const currentTime = new Date();
  const updateTTLTime = new Date(
    new Date(localStorageData.updatedAt).getTime() + localStorageData.ttl,
  );

  if (currentTime < updateTTLTime) {
    return CombineBooksFromStorage(localStorageData);
  }

  const newOnlineData = await getBookListOnline();
  localStorageData.online = newOnlineData;
  localStorageData.updatedAt = currentTime.toISOString();
  LocalStorage.Put("online", newOnlineData);
  LocalStorage.SetUpdatedAt(currentTime.toISOString());

  return CombineBooksFromStorage(localStorageData);
};

export const BookAdd = (book: BookCreate) => {
  const localStorageData = LocalStorage.Get();
  const localBooks = structuredClone(localStorageData.local);

  let id = 1_000_000; // arbitrary starting ID, not for production but fits for this test
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
