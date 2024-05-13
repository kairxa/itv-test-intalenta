import { BASE_API_URL } from "../constants";
import { Book } from "../types/book";
import { BookStorage } from "../types/storage";
import LocalStorage from "../utils/storage/localStorage";

const getListOnline = async (): Promise<Book[]> => {
  const response = await fetch(BASE_API_URL);
  const books: Book[] = await response.json();
  return books;
};

const GetList = async (): Promise<BookStorage> => {
  console.log("asdasd");
  const localStorageData = LocalStorage.Get();
  const currentTime = new Date();
  const updateTTLTime = new Date(
    new Date(localStorageData.updatedAt).getTime() + localStorageData.ttl,
  );

  if (currentTime < updateTTLTime) {
    return localStorageData;
  }

  const newOnlineData = await getListOnline();
  localStorageData.online = newOnlineData;
  localStorageData.updatedAt = currentTime.toISOString();

  return localStorageData;
};

export default GetList;
