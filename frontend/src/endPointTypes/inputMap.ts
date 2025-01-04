// This file is auto-generated from inputMap.json and endpointMap.json. Do not modify manually.

import { BookUpdateInput, BookCreateInput, BookshelveCreateInput, BookshelveUpdateInput, SettingsUpdateInput, SettingsCreateInput, UserCreateInput, UserUpdateInput } from './types';

export type InputMap = {
  "GET /book": {};
  "GET /book/getUserBooks": {
    query: { userId: string };
  };
  "PATCH /book/:id": {
    params: { id: string };
    body: BookUpdateInput;
  };
  "GET /book/:id": {
    params: { id: string };
  };
  "POST /book": {
    body: BookCreateInput;
  };
  "DELETE /book/:id": {
    params: { id: string };
  };
  "GET /bookshelve": {};
  "POST /bookshelve": {
    body: BookshelveCreateInput;
  };
  "PUT /bookshelve/:id": {
    params: { id: string };
    body: BookshelveUpdateInput;
  };
  "POST /bookshelve/:bookshelveId/books/:bookId": {
    params: { bookshelveId: string } & { bookId: string };
  };
  "DELETE /bookshelve/:id": {
    params: { id: string };
  };
  "GET /settings": {};
  "GET /settings/user/:userId": {
    params: { userId: string };
  };
  "GET /settings/:id": {
    params: { id: string };
  };
  "PATCH /settings/:id": {
    params: { id: string };
    body: SettingsUpdateInput;
  };
  "PATCH /settings/user/:userId": {
    params: { userId: string };
    body: SettingsUpdateInput;
  };
  "POST /settings": {
    body: SettingsCreateInput;
  };
  "POST /user": {
    body: UserCreateInput;
  };
  "GET /user": {};
  "GET /user/findOneByJwtPayload": {};
  "GET /user/:id": {
    params: { id: string };
  };
  "GET /user/username/:username": {
    params: { username: string };
  };
  "PUT /user/:id": {
    params: { id: string };
    body: UserUpdateInput;
  };
  "DELETE /user/:id": {
    params: { id: string };
  };
  "POST /auth/login": {};
  "POST /auth/register": {
    body: UserCreateInput;
  };
};

export default InputMap;
