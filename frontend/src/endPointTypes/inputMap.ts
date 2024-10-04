// This file is auto-generated from inputMap.json and endpointMap.json. Do not modify manually.

import { CreateUserDto, UpdateBookDto, CreateBookDto, CreateBookshelveDto, LoginDto } from './types';

export type InputMap = {
  "POST /user": {
<<<<<<< HEAD
=======
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
  "POST /auth/login": {};
  "POST /auth/register": {
>>>>>>> MongooseBackend
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
<<<<<<< HEAD
  "POST /auth/login": {
    body: LoginDto;
  };
  "POST /auth/register": {
    body: CreateUserDto;
  };
=======
>>>>>>> MongooseBackend
};

export default InputMap;
