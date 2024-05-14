import { BASE_API_URL } from "../constants";
import { Book } from "../types/book";
import CombineBooksFromStorage from "../utils/combine-books";
import LocalStorage from "../utils/storage/localStorage";

const getListOnline = async (): Promise<Book[]> => {
  const response = await fetch(BASE_API_URL);
  const books: Book[] = await response.json();
  return books;
};

const GetList = async (): Promise<Book[]> => {
  const localStorageData = LocalStorage.Get();
  const currentTime = new Date();
  const updateTTLTime = new Date(
    new Date(localStorageData.updatedAt).getTime() + localStorageData.ttl,
  );

  if (currentTime < updateTTLTime) {
    return CombineBooksFromStorage(localStorageData);
  }

  const newOnlineData = await getListOnline();
  localStorageData.online = newOnlineData;
  localStorageData.updatedAt = currentTime.toISOString();
  LocalStorage.Put("online", newOnlineData);
  LocalStorage.SetUpdatedAt(currentTime.toISOString());

  return CombineBooksFromStorage(localStorageData);
};

export default GetList;
