import {
  STORAGE_DEFAULT_TTL,
  STORAGE_KEY,
  STORAGE_KEY_FAVORITES,
  STORAGE_KEY_LOCAL,
  STORAGE_KEY_ONLINE,
  STORAGE_KEY_TTL,
  STORAGE_KEY_UPDATEDAT,
} from "../../constants";
import { Book } from "../../types/book";
import { StorageMethods } from "../../types/storage";

const LocalStorage: StorageMethods = {
  Put: (dataSource, books) => {
    localStorage.setItem(`${STORAGE_KEY}_${dataSource}`, JSON.stringify(books));
  },
  Delete: (id) => {
    const localBooks = LocalStorage.GetLocal();
    const updatedLocalBooks = localBooks.filter((book) => book.id !== id);

    localStorage.setItem(STORAGE_KEY_LOCAL, JSON.stringify(updatedLocalBooks));
  },
  GetOnline: (): Book[] => {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY_ONLINE) || "[]",
    ) as Book[];
  },
  GetLocal: (): Book[] => {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY_LOCAL) || "[]",
    ) as Book[];
  },
  GetFavorites: (): number[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_FAVORITES) || "[]");
  },
  Get: () => {
    const onlineBooks = LocalStorage.GetOnline();
    const localBooks = LocalStorage.GetLocal();
    const favoriteList = LocalStorage.GetFavorites();

    return {
      online: onlineBooks,
      local: localBooks,
      favorites: favoriteList,
      updatedAt:
        localStorage.getItem(STORAGE_KEY_UPDATEDAT) ||
        "1970-01-01T00:00:00.000Z",
      ttl: parseInt(
        localStorage.getItem(STORAGE_KEY_TTL) || `${STORAGE_DEFAULT_TTL}`,
        10,
      ),
    };
  },
  SetFavorites: (favorites: number[]) => {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
  },
  SetTTL: (ttl) => {
    localStorage.setItem(STORAGE_KEY_TTL, `${ttl}`);
  },
  SetUpdatedAt: (updatedAt) => {
    localStorage.setItem(STORAGE_KEY_UPDATEDAT, updatedAt);
  },
};

export default LocalStorage;
