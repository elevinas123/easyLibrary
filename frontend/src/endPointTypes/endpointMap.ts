// This file is auto-generated from endpointMap.json. Do not modify manually.

import { Book } from "../Modules/LibraryPage/LibraryPage";

export const endpointMap = {
  "GET /book": "Book[]",
  "GET /book/getUserBooks": "Book[]",
  "PATCH /book/:id": "Book",
  "GET /book/:id": "Book",
  "POST /book": "Book",
  "DELETE /book/:id": "Book",
} as const;

export type Endpoint = keyof typeof endpointMap;

export type ApiResponseTypes = {
  "GET /book": Book[];
  "GET /book/getUserBooks": Book[];
  "PATCH /book/:id": Book;
  "GET /book/:id": Book;
  "POST /book": Book;
  "DELETE /book/:id": Book;
};
