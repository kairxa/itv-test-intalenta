import { STORAGE_KEY } from "../../constants";
import { Book } from "../../types/book";
import { StorageMethods } from "../../types/storage";

const LocalStorage: StorageMethods = {
  Put: (dataSource, books) => {
    localStorage.setItem(`${STORAGE_KEY}_${dataSource}`, JSON.stringify(books));
  },
  Delete: (id) => {
    const storageKey = `${STORAGE_KEY}_local`;
    const localBooks = JSON.parse(
      localStorage.getItem(storageKey) || `[]`,
    ) as Book[];

    const updatedLocalBooks = localBooks.filter((book) => book.id !== id);

    localStorage.setItem(storageKey, JSON.stringify(updatedLocalBooks));
  },
  Get: () => {
    const onlineBooks = JSON.parse(
      localStorage.getItem(`${STORAGE_KEY}_online`) || "[]",
    ) as Book[];
    const localBooks = JSON.parse(
      localStorage.getItem(`${STORAGE_KEY}_local`) || "[]",
    ) as Book[];
    const favoriteList = JSON.parse(
      localStorage.getItem(`${STORAGE_KEY}_favorites`) || "[]",
    ) as string[];

    return {
      online: onlineBooks,
      local: localBooks,
      favorites: favoriteList,
      updatedAt: localStorage.getItem(`${STORAGE_KEY}_updatedAt`) || "",
      ttl: parseInt(localStorage.getItem(`${STORAGE_KEY}_ttl`) || `0`, 10),
    };
  },
  ToggleFavorite: (id: string) => {
    const favoriteList = JSON.parse(
      localStorage.getItem("favorites") || "[]",
    ) as string[];

    const favoriteIdx = favoriteList.indexOf(id);

    if (favoriteIdx === -1) {
      favoriteList.push(id);
    } else {
      favoriteList.splice(favoriteIdx, 1);
    }

    localStorage.setItem("favorites", JSON.stringify(favoriteList));
  },
  SetTTL: (ttl) => {
    localStorage.setItem(`${STORAGE_KEY}_ttl`, `${ttl}`);
  },
};

export default LocalStorage;
