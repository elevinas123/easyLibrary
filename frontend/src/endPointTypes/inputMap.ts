// This file is auto-generated from inputMap.json and endpointMap.json. Do not modify manually.

export type InputMap = {
    "GET /book": {};
    "GET /book/getUserBooks": {
        query: { userId: string };
    };
    "PATCH /book/:id": {
        params: { id: string };
        body: any;
    };
    "GET /book/:id": {
        params: { id: string };
    };
    "POST /book": {
        body: any;
    };
    "DELETE /book/:id": {
        params: { id: string };
    };
    "GET /bookshelve": {};
    "POST /bookshelve": {
        body: any;
    };
    "PUT /bookshelve/:id": {
        params: { id: string };
        body: any;
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
        body: any;
    };
    "PATCH /settings/user/:userId": {
        params: { userId: string };
        body: any;
    };
    "POST /settings": {
        body: any;
    };
    "POST /user": {
        body: any;
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
        body: any;
    };
    "DELETE /user/:id": {
        params: { id: string };
    };
    "POST /auth/login": {};
    "POST /auth/register": {
        body: any;
    };
};

export default InputMap;
