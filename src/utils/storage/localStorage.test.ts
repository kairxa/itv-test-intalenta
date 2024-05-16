import { beforeEach, describe, expect, it, mock } from "bun:test";
import LocalStorage from "./localStorage";
import {
  STORAGE_KEY_FAVORITES,
  STORAGE_KEY_LOCAL,
  STORAGE_KEY_ONLINE,
  STORAGE_KEY_TTL,
  STORAGE_KEY_UPDATEDAT,
} from "../../constants";

const getItemMock = mock();
const setItemMock = mock();

global.localStorage = {
  ...global.localStorage,
  getItem: getItemMock,
  setItem: setItemMock,
};

describe("LocalStorage helpers", () => {
  beforeEach(() => {
    setItemMock.mockReset();
    getItemMock.mockReset();
  });

  it("should put data to localStorage", () => {
    const mockData = [
      {
        id: 1,
        cover: "asdasd",
        title: "Title",
        author: "Me",
        description: "Describe",
        publicationDate: "sometime",
      },
    ];
    LocalStorage.Put("online", mockData);

    expect(setItemMock).toHaveBeenCalledWith(
      STORAGE_KEY_ONLINE,
      JSON.stringify(mockData),
    );
  });

  it("should delete existing item", () => {
    getItemMock.mockReturnValueOnce('[{"id":1},{"id":2}]');

    LocalStorage.Delete(1);

    expect(setItemMock).toHaveBeenCalledWith(STORAGE_KEY_LOCAL, '[{"id":2}]');
  });

  it("should get existing data", () => {
    getItemMock.mockReturnValueOnce('[{"id":1},{"id":2}]'); // online
    getItemMock.mockReturnValueOnce('[{"id":3},{"id":4}]'); // local
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites
    getItemMock.mockReturnValueOnce("2024-05-14T15:49:22.087Z"); // updated at
    getItemMock.mockReturnValueOnce(`${1_800_000}`); // ttl

    const data = LocalStorage.Get();

    expect(data).toMatchObject({
      online: [{ id: 1 }, { id: 2 }],
      local: [{ id: 3 }, { id: 4 }],
      favorites: [1, 4],
      updatedAt: "2024-05-14T15:49:22.087Z",
      ttl: 1800000,
    });
  });

  it("should set favorites", () => {
    const favorites = [1, 4];

    LocalStorage.SetFavorites(favorites);

    expect(setItemMock).toHaveBeenCalledWith(
      STORAGE_KEY_FAVORITES,
      JSON.stringify(favorites),
    );
  });

  it("should update ttl", () => {
    LocalStorage.SetTTL(7_200_000);

    expect(setItemMock).toHaveBeenCalledWith(STORAGE_KEY_TTL, "7200000");
  });

  it("should update updatedAt", () => {
    LocalStorage.SetUpdatedAt("2024-05-14T15:49:22.087Z");

    expect(setItemMock).toHaveBeenCalledWith(
      STORAGE_KEY_UPDATEDAT,
      "2024-05-14T15:49:22.087Z",
    );
  });
});
