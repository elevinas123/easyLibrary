// This file is auto-generated from endpointMap.json. Do not modify manually.

import { User, Book, Bookshelve, SettingsType } from './types';

export const endpointMap = {
  "POST /user": "User",
  "GET /user": "User[]",
  "GET /user/findOneByJwtPayload": "User",
  "GET /user/:id": "User",
  "GET /user/:username": "User",
  "PUT /user/:id": "User",
  "DELETE /user/:id": "User",
  "POST /auth/login": "{ access_token: string; user: any; }",
  "POST /auth/register": "User",
  "GET /book": "Book[]",
  "GET /book/getUserBooks": "Book[]",
  "PATCH /book/:id": "Book",
  "GET /book/:id": "Book",
  "POST /book": "Book",
  "DELETE /book/:id": "Book",
  "GET /bookshelve": "Bookshelve[]",
  "POST /bookshelve": "Bookshelve",
  "PUT /bookshelve/:id": "Bookshelve",
  "DELETE /bookshelve/:id": "Bookshelve",
  "GET /settings": "SettingsType[]",
  "GET /settings/user/:userId": "SettingsType",
  "GET /settings/:id": "SettingsType",
  "PATCH /settings/:id": "SettingsType",
  "PATCH /settings/user/:userId": "SettingsType",
  "POST /settings": "SettingsType",
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
  "POST /auth/login": { access_token: string; user: any; };
  "POST /auth/register": User;
  "GET /book": Book[];
  "GET /book/getUserBooks": Book[];
  "PATCH /book/:id": Book;
  "GET /book/:id": Book;
  "POST /book": Book;
  "DELETE /book/:id": Book;
  "GET /bookshelve": Bookshelve[];
  "POST /bookshelve": Bookshelve;
  "PUT /bookshelve/:id": Bookshelve;
  "DELETE /bookshelve/:id": Bookshelve;
  "GET /settings": SettingsType[];
  "GET /settings/user/:userId": SettingsType;
  "GET /settings/:id": SettingsType;
  "PATCH /settings/:id": SettingsType;
  "PATCH /settings/user/:userId": SettingsType;
  "POST /settings": SettingsType;
};
