import { beforeEach, describe, expect, it, mock } from "bun:test";
import LocalStorage from "./localStorage";

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
      "ITV_TEST_STORE_online",
      JSON.stringify(mockData),
    );
  });

  it("should delete existing item", () => {
    getItemMock.mockReturnValueOnce('[{"id":1},{"id":2}]');

    LocalStorage.Delete(1);

    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_local",
      '[{"id":2}]',
    );
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

  it("should toggle favorites on and off", () => {
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites

    LocalStorage.ToggleFavorite(1);

    expect(setItemMock).toHaveBeenCalledWith("ITV_TEST_STORE_favorites", "[4]");

    LocalStorage.ToggleFavorite(2);

    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_favorites",
      "[1,4,2]",
    );
  });

  it("should update ttl", () => {
    LocalStorage.SetTTL(7_200_000);

    expect(setItemMock).toHaveBeenCalledWith("ITV_TEST_STORE_ttl", "7200000");
  });

  it("should update updatedAt", () => {
    LocalStorage.SetUpdatedAt("2024-05-14T15:49:22.087Z");

    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_updatedAt",
      "2024-05-14T15:49:22.087Z",
    );
  });
});
