// This file is auto-generated from endpointMap.json. Do not modify manually.

export const endpointMap = {
  "GET /book": "{ id: string; title: string; description: string; author: string; imageUrl: string; liked: boolean; dateAdded: Date; scale: number; userId: string; }[]",
  "GET /book/getUserBooks": "{ id: string; title: string; description: string; author: string; }[]",
  "PATCH /book/:id": "{ id: string; title: string; description: string; author: string; imageUrl: string; liked: boolean; dateAdded: Date; scale: number; userId: string; }",
  "GET /book/:id": "{ id: string; title: string; description: string; author: string; imageUrl: string; liked: boolean; dateAdded: Date; scale: number; userId: string; }",
  "POST /book": "{ id: string; title: string; description: string; author: string; imageUrl: string; liked: boolean; dateAdded: Date; scale: number; userId: string; }",
  "DELETE /book/:id": "{ id: string; title: string; description: string; author: string; imageUrl: string; liked: boolean; dateAdded: Date; scale: number; userId: string; }",
  "GET /bookshelve": "{ id: string; userId: string; name: string; createdAt: Date; }[]",
  "POST /bookshelve": "{ id: string; userId: string; name: string; createdAt: Date; }",
  "PUT /bookshelve/:id": "{ id: string; userId: string; name: string; createdAt: Date; }",
  "POST /bookshelve/:bookshelveId/books/:bookId": "{ id: string; userId: string; name: string; createdAt: Date; }",
  "DELETE /bookshelve/:id": "{ id: string; userId: string; name: string; createdAt: Date; }",
  "GET /settings": "{ id: string; userId: string; fontSize: number; fontFamily: string; lineHeight: number; backgroundColor: string; textColor: string; darkMode: boolean; }[]",
  "GET /settings/user/:userId": "{ id: string; userId: string; fontSize: number; fontFamily: string; lineHeight: number; backgroundColor: string; textColor: string; darkMode: boolean; }",
  "GET /settings/:id": "{ id: string; userId: string; fontSize: number; fontFamily: string; lineHeight: number; backgroundColor: string; textColor: string; darkMode: boolean; }",
  "PATCH /settings/:id": "{ id: string; userId: string; fontSize: number; fontFamily: string; lineHeight: number; backgroundColor: string; textColor: string; darkMode: boolean; }",
  "PATCH /settings/user/:userId": "{ id: string; userId: string; fontSize: number; fontFamily: string; lineHeight: number; backgroundColor: string; textColor: string; darkMode: boolean; }",
  "POST /settings": "{ id: string; userId: string; fontSize: number; fontFamily: string; lineHeight: number; backgroundColor: string; textColor: string; darkMode: boolean; }",
  "POST /user": "{ id: string; username: string; age: number; password: string; comment: string | null; }",
  "GET /user": "{ id: string; username: string; age: number; password: string; comment: string | null; }[]",
  "GET /user/findOneByJwtPayload": "{ id: string; username: string; age: number; password: string; comment: string | null; }",
  "GET /user/:id": "{ id: string; username: string; age: number; password: string; comment: string | null; }",
  "GET /user/username/:username": "{ id: string; username: string; age: number; password: string; comment: string | null; }",
  "PUT /user/:id": "{ id: string; username: string; age: number; password: string; comment: string | null; }",
  "DELETE /user/:id": "{ id: string; username: string; age: number; password: string; comment: string | null; }",
  "POST /auth/login": "{ access_token: string; user: any; }",
  "POST /auth/register": "{ id: string; username: string; age: number; password: string; comment: string | null; }",
} as const;

export type Endpoint = keyof typeof endpointMap;

export type ApiResponseTypes = {
  "GET /book": { id: string; title: string; description: string; author: string; imageUrl: string; liked: boolean; dateAdded: Date; scale: number; userId: string; }[];
  "GET /book/getUserBooks": { id: string; title: string; description: string; author: string; }[];
  "PATCH /book/:id": { id: string; title: string; description: string; author: string; imageUrl: string; liked: boolean; dateAdded: Date; scale: number; userId: string; };
  "GET /book/:id": { id: string; title: string; description: string; author: string; imageUrl: string; liked: boolean; dateAdded: Date; scale: number; userId: string; };
  "POST /book": { id: string; title: string; description: string; author: string; imageUrl: string; liked: boolean; dateAdded: Date; scale: number; userId: string; };
  "DELETE /book/:id": { id: string; title: string; description: string; author: string; imageUrl: string; liked: boolean; dateAdded: Date; scale: number; userId: string; };
  "GET /bookshelve": { id: string; userId: string; name: string; createdAt: Date; }[];
  "POST /bookshelve": { id: string; userId: string; name: string; createdAt: Date; };
  "PUT /bookshelve/:id": { id: string; userId: string; name: string; createdAt: Date; };
  "POST /bookshelve/:bookshelveId/books/:bookId": { id: string; userId: string; name: string; createdAt: Date; };
  "DELETE /bookshelve/:id": { id: string; userId: string; name: string; createdAt: Date; };
  "GET /settings": { id: string; userId: string; fontSize: number; fontFamily: string; lineHeight: number; backgroundColor: string; textColor: string; darkMode: boolean; }[];
  "GET /settings/user/:userId": { id: string; userId: string; fontSize: number; fontFamily: string; lineHeight: number; backgroundColor: string; textColor: string; darkMode: boolean; };
  "GET /settings/:id": { id: string; userId: string; fontSize: number; fontFamily: string; lineHeight: number; backgroundColor: string; textColor: string; darkMode: boolean; };
  "PATCH /settings/:id": { id: string; userId: string; fontSize: number; fontFamily: string; lineHeight: number; backgroundColor: string; textColor: string; darkMode: boolean; };
  "PATCH /settings/user/:userId": { id: string; userId: string; fontSize: number; fontFamily: string; lineHeight: number; backgroundColor: string; textColor: string; darkMode: boolean; };
  "POST /settings": { id: string; userId: string; fontSize: number; fontFamily: string; lineHeight: number; backgroundColor: string; textColor: string; darkMode: boolean; };
  "POST /user": { id: string; username: string; age: number; password: string; comment: string | null; };
  "GET /user": { id: string; username: string; age: number; password: string; comment: string | null; }[];
  "GET /user/findOneByJwtPayload": { id: string; username: string; age: number; password: string; comment: string | null; };
  "GET /user/:id": { id: string; username: string; age: number; password: string; comment: string | null; };
  "GET /user/username/:username": { id: string; username: string; age: number; password: string; comment: string | null; };
  "PUT /user/:id": { id: string; username: string; age: number; password: string; comment: string | null; };
  "DELETE /user/:id": { id: string; username: string; age: number; password: string; comment: string | null; };
  "POST /auth/login": { access_token: string; user: any; };
  "POST /auth/register": { id: string; username: string; age: number; password: string; comment: string | null; };
};
