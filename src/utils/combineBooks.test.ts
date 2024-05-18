import { describe, expect, it } from "bun:test";
import { BookStorage } from "../types/storage";
import { STORAGE_DEFAULT_TTL } from "../constants";
import CombineBooksFromStorage from "./combineBooks";

describe("CombineBooksFromStorage", () => {
  it("should combine books properly", () => {
    const storageData: BookStorage = {
      online: [
        {
          id: 1,
          author: "Me",
          title: "If I Were You",
          description: "I'd wanna be me too",
          cover: "https://placehold.it",
          publicationDate: "sometime",
        },
      ],
      local: [
        {
          id: 3,
          author: "You",
          title: "Would Never Ask Me Why",
          description: "My heart is so disguised",
          cover: "https://placehold.it",
          publicationDate: "sometime",
        },
      ],
      favorites: [3],
      updatedAt: "not important for this test",
      ttl: STORAGE_DEFAULT_TTL,
    };

    const result = CombineBooksFromStorage(storageData);

    expect(result).toMatchObject([
      {
        id: 3,
        author: "You",
        title: "Would Never Ask Me Why",
        description: "My heart is so disguised",
        cover: "https://placehold.it",
        publicationDate: "sometime",
        favorite: true,
      },
      {
        id: 1,
        author: "Me",
        title: "If I Were You",
        description: "I'd wanna be me too",
        cover: "https://placehold.it",
        publicationDate: "sometime",
        favorite: false,
      },
    ]);
  });
});
