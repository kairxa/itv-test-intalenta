import {
  beforeEach,
  describe,
  setSystemTime,
  beforeAll,
  expect,
  it,
  mock,
} from "bun:test";
import {
  BookAdd,
  BookDelete,
  BookFavorite,
  BookGetByID,
  BookListGet,
  BookUpdate,
} from "./book";

// Sad that we need to mock the whole localStorage again here :')
// https://github.com/oven-sh/bun/issues/10428
const getItemMock = mock();
const setItemMock = mock();
const fetchMock = mock();
global.localStorage = {
  ...global.localStorage,
  getItem: getItemMock,
  setItem: setItemMock,
};
global.fetch = fetchMock;

describe("Book List operations", () => {
  beforeAll(() => {
    setSystemTime(new Date("2024-05-14T15:49:22.087Z"));
  });

  beforeEach(() => {
    getItemMock.mockReset();
    setItemMock.mockReset();
    fetchMock.mockReset();
  });

  it("should BookListGet of books", async () => {
    getItemMock.mockReturnValueOnce('[{"id":1},{"id":2}]'); // online
    getItemMock.mockReturnValueOnce('[{"id":3},{"id":4}]'); // local
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites
    getItemMock.mockReturnValueOnce("2024-05-14T15:49:22.087Z"); // updated at
    getItemMock.mockReturnValueOnce(`${1_800_000}`); // ttl
    const bookList = await BookListGet({});

    expect(bookList).toMatchObject([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ]);
    expect(setItemMock).not.toHaveBeenCalled();
  });

  it("should BookListGet of books sorted by favorites", async () => {
    getItemMock.mockReturnValueOnce('[{"id":1},{"id":2}]'); // online
    getItemMock.mockReturnValueOnce('[{"id":3},{"id":4}]'); // local
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites
    getItemMock.mockReturnValueOnce("2024-05-14T15:49:22.087Z"); // updated at
    getItemMock.mockReturnValueOnce(`${1_800_000}`); // ttl
    const bookList = await BookListGet({ showFavoritesFirst: true });

    expect(bookList).toMatchObject([
      { id: 1 },
      { id: 4 },
      { id: 2 },
      { id: 3 },
    ]);
    expect(setItemMock).not.toHaveBeenCalled();
  });

  it("should BookListGet of books from fetch", async () => {
    fetchMock.mockResolvedValueOnce({
      json: () => {
        return [{ id: 5 }, { id: 6 }];
      },
    });
    getItemMock.mockReturnValueOnce('[{"id":1},{"id":2}]'); // online
    getItemMock.mockReturnValueOnce('[{"id":3},{"id":4}]'); // local
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites
    getItemMock.mockReturnValueOnce("2024-05-13T15:49:22.087Z"); // updated at
    getItemMock.mockReturnValueOnce(`${1_800_000}`); // ttl
    const bookList = await BookListGet({});

    expect(bookList).toMatchObject([
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
    ]);
    expect(setItemMock).toHaveBeenCalledTimes(2);
    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_online",
      JSON.stringify([{ id: 5 }, { id: 6 }]),
    );
    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_updatedAt",
      "2024-05-14T15:49:22.087Z",
    );
  });

  it("should BookListGet of books from fetch with sorted favorites", async () => {
    fetchMock.mockResolvedValueOnce({
      json: () => {
        return [{ id: 5 }, { id: 6 }];
      },
    });
    getItemMock.mockReturnValueOnce('[{"id":1},{"id":2}]'); // online
    getItemMock.mockReturnValueOnce('[{"id":3},{"id":4}]'); // local
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites
    getItemMock.mockReturnValueOnce("2024-05-13T15:49:22.087Z"); // updated at
    getItemMock.mockReturnValueOnce(`${1_800_000}`); // ttl
    const bookList = await BookListGet({ showFavoritesFirst: true });

    expect(bookList).toMatchObject([
      { id: 4 },
      { id: 3 },
      { id: 5 },
      { id: 6 },
    ]);
    expect(setItemMock).toHaveBeenCalledTimes(2);
    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_online",
      JSON.stringify([{ id: 5 }, { id: 6 }]),
    );
    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_updatedAt",
      "2024-05-14T15:49:22.087Z",
    );
  });

  it("should get book by ID", async () => {
    getItemMock.mockReturnValueOnce('[{"id":1},{"id":2}]'); // online
    getItemMock.mockReturnValueOnce('[{"id":3},{"id":4}]'); // local
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites
    getItemMock.mockReturnValueOnce("2024-05-14T15:49:22.087Z"); // updated at
    getItemMock.mockReturnValueOnce(`${1_800_000}`); // ttl

    const book = await BookGetByID(3);

    expect(book).toMatchObject({ id: 3 });
  });

  it("should add initial book to local list", () => {
    getItemMock.mockReturnValueOnce('[{"id":1},{"id":2}]'); // online
    getItemMock.mockReturnValueOnce(undefined); // local
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites
    getItemMock.mockReturnValueOnce("2024-05-13T15:49:22.087Z"); // updated at
    getItemMock.mockReturnValueOnce(`${1_800_000}`); // ttl

    BookAdd({
      title: "Title",
      author: "Me",
      description: "Description",
      cover: "",
      publicationDate: "2024-05-13T15:49:22.087Z",
    });

    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_local",
      JSON.stringify([
        {
          title: "Title",
          author: "Me",
          description: "Description",
          cover: "",
          publicationDate: "2024-05-13T15:49:22.087Z",
          id: 1000000,
        },
      ]),
    );
  });

  it("should add another book to local list", () => {
    const initialLocal = JSON.stringify([
      {
        title: "Title 2",
        author: "Another Me",
        description: "Description 2",
        cover: "",
        publicationDate: "2024-05-14T15:49:22.087Z",
        id: 1000001,
      },
      {
        title: "Title",
        author: "Me",
        description: "Description",
        cover: "",
        publicationDate: "2024-05-13T15:49:22.087Z",
        id: 1000000,
      },
    ]);
    getItemMock.mockReturnValueOnce('[{"id":1},{"id":2}]'); // online
    getItemMock.mockReturnValueOnce(initialLocal); // local
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites
    getItemMock.mockReturnValueOnce("2024-05-13T15:49:22.087Z"); // updated at
    getItemMock.mockReturnValueOnce(`${1_800_000}`); // ttl

    BookAdd({
      title: "Title 3",
      author: "Yet Another Me",
      description: "Description 3",
      cover: "",
      publicationDate: "2024-05-14T15:49:22.087Z",
    });

    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_local",
      JSON.stringify([
        {
          title: "Title",
          author: "Me",
          description: "Description",
          cover: "",
          publicationDate: "2024-05-13T15:49:22.087Z",
          id: 1000000,
        },
        {
          title: "Title 2",
          author: "Another Me",
          description: "Description 2",
          cover: "",
          publicationDate: "2024-05-14T15:49:22.087Z",
          id: 1000001,
        },
        {
          title: "Title 3",
          author: "Yet Another Me",
          description: "Description 3",
          cover: "",
          publicationDate: "2024-05-14T15:49:22.087Z",
          id: 1000002,
        },
      ]),
    );
  });

  it("should update a book", () => {
    const initialLocal = JSON.stringify([
      {
        title: "Title",
        author: "Me",
        description: "Description",
        cover: "",
        publicationDate: "2024-05-13T15:49:22.087Z",
        id: 1000000,
      },
      {
        title: "Title 2",
        author: "Another Me",
        description: "Description 2",
        cover: "",
        publicationDate: "2024-05-14T15:49:22.087Z",
        id: 1000001,
      },
    ]);
    getItemMock.mockReturnValueOnce('[{"id":1},{"id":2}]'); // online
    getItemMock.mockReturnValueOnce(initialLocal); // local
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites
    getItemMock.mockReturnValueOnce("2024-05-13T15:49:22.087Z"); // updated at
    getItemMock.mockReturnValueOnce(`${1_800_000}`); // ttl

    BookUpdate({
      title: "Title Update 2",
      author: "Not Me",
      description: "Description update 2",
      cover: "",
      publicationDate: "2024-05-14T15:49:22.087Z",
      id: 1000001,
    });

    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_local",
      JSON.stringify([
        {
          title: "Title",
          author: "Me",
          description: "Description",
          cover: "",
          publicationDate: "2024-05-13T15:49:22.087Z",
          id: 1000000,
        },
        {
          title: "Title Update 2",
          author: "Not Me",
          description: "Description update 2",
          cover: "",
          publicationDate: "2024-05-14T15:49:22.087Z",
          id: 1000001,
        },
      ]),
    );
  });

  it("should leave the books alone", () => {
    const initialLocal = JSON.stringify([
      {
        title: "Title",
        author: "Me",
        description: "Description",
        cover: "",
        publicationDate: "2024-05-13T15:49:22.087Z",
        id: 1000000,
      },
      {
        title: "Title 2",
        author: "Another Me",
        description: "Description 2",
        cover: "",
        publicationDate: "2024-05-14T15:49:22.087Z",
        id: 1000001,
      },
    ]);
    getItemMock.mockReturnValueOnce('[{"id":1},{"id":2}]'); // online
    getItemMock.mockReturnValueOnce(initialLocal); // local
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites
    getItemMock.mockReturnValueOnce("2024-05-13T15:49:22.087Z"); // updated at
    getItemMock.mockReturnValueOnce(`${1_800_000}`); // ttl

    BookUpdate({
      title: "Title Update 2",
      author: "Not Me",
      description: "Description update 2",
      cover: "",
      publicationDate: "2024-05-14T15:49:22.087Z",
      id: 1000066,
    });

    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_local",
      JSON.stringify([
        {
          title: "Title",
          author: "Me",
          description: "Description",
          cover: "",
          publicationDate: "2024-05-13T15:49:22.087Z",
          id: 1000000,
        },
        {
          title: "Title 2",
          author: "Another Me",
          description: "Description 2",
          cover: "",
          publicationDate: "2024-05-14T15:49:22.087Z",
          id: 1000001,
        },
      ]),
    );
  });

  it("should delete a book", () => {
    const initialLocal = JSON.stringify([
      {
        title: "Title",
        author: "Me",
        description: "Description",
        cover: "",
        publicationDate: "2024-05-13T15:49:22.087Z",
        id: 1000000,
      },
      {
        title: "Title 2",
        author: "Another Me",
        description: "Description 2",
        cover: "",
        publicationDate: "2024-05-14T15:49:22.087Z",
        id: 1000001,
      },
    ]);
    getItemMock.mockReturnValueOnce(initialLocal); // local

    BookDelete(1000001);

    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_local",
      JSON.stringify([
        {
          title: "Title",
          author: "Me",
          description: "Description",
          cover: "",
          publicationDate: "2024-05-13T15:49:22.087Z",
          id: 1000000,
        },
      ]),
    );
  });

  it("should favorite a book", () => {
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites

    BookFavorite(3);

    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_favorites",
      JSON.stringify([1, 4, 3]),
    );
  });

  it("should unfavorite a book", () => {
    getItemMock.mockReturnValueOnce("[1,4]"); // favorites

    BookFavorite(4);

    expect(setItemMock).toHaveBeenCalledWith(
      "ITV_TEST_STORE_favorites",
      JSON.stringify([1]),
    );
  });
});
