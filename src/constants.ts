export const STORAGE_KEY = "ITV_TEST_STORE";
export const STORAGE_KEY_ONLINE = `${STORAGE_KEY}_online`;
export const STORAGE_KEY_LOCAL = `${STORAGE_KEY}_local`;
export const STORAGE_KEY_FAVORITES = `${STORAGE_KEY}_favorites`;
export const STORAGE_KEY_TTL = `${STORAGE_KEY}_ttl`;
export const STORAGE_KEY_UPDATEDAT = `${STORAGE_KEY}_updatedAt`;

export const STORAGE_DEFAULT_TTL = 3_600_000; // 60 * 60 * 1000

export const BOOK_LOCAL_MIN_STARTING_ID = 1_000_000;

export const URL_REGEX_VALIDATION = /^(http|https):\/\//i; // not a serious validation, just for the sake of regex testing.

export const BASE_API_URL =
  "https://my-json-server.typicode.com/cutamar/mock/books";
