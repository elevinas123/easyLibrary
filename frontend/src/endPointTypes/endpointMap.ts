// This file is auto-generated from endpointMap.json. Do not modify manually.

import { User, Bookshelve, Book } from './types';

export const endpointMap = {
  "POST /user": "User",
  "GET /user": "User[]",
  "GET /user/findOneByJwtPayload": "User",
  "GET /user/:id": "User",
  "GET /user/:username": "User",
  "PUT /user/:id": "User",
  "DELETE /user/:id": "User",
  "GET /bookshelve": "Bookshelve[]",
  "POST /bookshelve": "Bookshelve",
  "PUT /bookshelve/:id": "Bookshelve",
  "DELETE /bookshelve/:id": "Bookshelve",
  "POST /auth/login": "{ access_token: string; user: any; }",
  "POST /auth/register": "User",
  "GET /book": "Book[]",
  "GET /book/getUserBooks": "Book[]",
  "PATCH /book/:id": "Book",
  "GET /book/:id": "Book",
  "POST /book": "Book",
  "DELETE /book/:id": "Book",
} as const;

export type Endpoint = keyof typeof endpointMap;

export type ApiResponseTypes = {
  "POST /user": User;
  "GET /user": User[];
  "GET /user/findOneByJwtPayload": User;
  "GET /user/:id": User;
  "GET /user/:username": User;
  "PUT /user/:id": User;
  "DELETE /user/:id": User;
  "GET /bookshelve": Bookshelve[];
  "POST /bookshelve": Bookshelve;
  "PUT /bookshelve/:id": Bookshelve;
  "DELETE /bookshelve/:id": Bookshelve;
  "POST /auth/login": { access_token: string; user: any; };
  "POST /auth/register": User;
  "GET /book": Book[];
  "GET /book/getUserBooks": Book[];
  "PATCH /book/:id": Book;
  "GET /book/:id": Book;
  "POST /book": Book;
  "DELETE /book/:id": Book;
};
