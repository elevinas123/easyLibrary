// This file is auto-generated from endpointMap.json. Do not modify manually.

export const endpointMap = {
  "GET book": "Promise<Book[]>",
  "GET book/getUserBooks": "Promise<Book[]>",
  "PATCH book:id": "Promise<Book>",
  "GET book:id": "Promise<Book>",
  "POST book": "Promise<Book>",
  "DELETE book:id": "Promise<Book>",
} as const;

export type Endpoint = keyof typeof endpointMap;

export type ApiResponseTypes = {
  "GET book": Book[];
  "GET book/getUserBooks": Book[];
  "PATCH book:id": Book;
  "GET book:id": Book;
  "POST book": Book;
  "DELETE book:id": Book;
};
