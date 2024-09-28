// This file is auto-generated from inputMap.json and endpointMap.json. Do not modify manually.

import { CreateUserDto, UpdateBookDto, CreateBookDto, CreateBookshelveDto } from './types';

export type InputMap = {
  "POST /auth/login": {};
  "POST /auth/register": {
    body: CreateUserDto;
  };
  "GET /book": {};
  "GET /book/getUserBooks": {
    query: { userId: string };
  };
  "PATCH /book/:id": {
    params: { id: string };
    body: UpdateBookDto;
  };
  "GET /book/:id": {
    params: { id: string };
  };
  "POST /book": {
    body: CreateBookDto;
  };
  "DELETE /book/:id": {
    params: { id: string };
  };
  "GET /bookshelve": {};
  "POST /bookshelve": {
    body: CreateBookshelveDto;
  };
  "PUT /bookshelve/:id": {
    params: { id: string };
    body: CreateBookshelveDto;
  };
  "DELETE /bookshelve/:id": {
    params: { id: string };
  };
  "POST /user": {
    body: CreateUserDto;
  };
  "GET /user": {};
  "GET /user/findOneByJwtPayload": {};
  "GET /user/:id": {
    params: { id: string };
  };
  "GET /user/:username": {
    params: { username: string };
  };
  "PUT /user/:id": {
    params: { id: string };
    body: CreateUserDto;
  };
  "DELETE /user/:id": {
    params: { id: string };
  };
};

export default InputMap;
