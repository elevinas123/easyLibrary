// This file is auto-generated from inputMap.json and endpointMap.json. Do not modify manually.

import { CreateBookDto, UpdateBookDto } from "./types";

export type InputMap = {
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
};

export default InputMap;
