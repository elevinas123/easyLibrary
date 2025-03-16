import { apiFetch } from "../endPointTypes/apiClient";

// Types
export type Collection = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  bookCount?: number;
  books?: CollectionBook[];
};

export type CollectionBook = {
  id: string;
  title: string;
  author: string;
  imageUrl: string | null;
  addedAt: string;
  genres?: string[];
};

export type CollectionFormData = {
  name: string;
  description?: string;
  imageUrl?: string;
};

// Fetch user collections
export const fetchUserCollections = async (userId: string, accessToken: string) => {
  const response = await apiFetch(
    "GET /collection",
    { query: { userId } },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
};

// Fetch a specific collection by ID
export const fetchCollectionById = async (id: string, accessToken: string) => {
  const response = await apiFetch(
    "GET /collection/:id",
    { params: { id } },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
};

// Create a new collection
export const createCollection = async (data: CollectionFormData, accessToken: string) => {
  const response = await apiFetch(
    "POST /collection",
    { body: data },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
};

// Update an existing collection
export const updateCollection = async (id: string, data: CollectionFormData, accessToken: string) => {
  const response = await apiFetch(
    "PUT /collection/:id",
    { params: { id }, body: data },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
};

// Delete a collection
export const deleteCollection = async (id: string, accessToken: string) => {
  const response = await apiFetch(
    "DELETE /collection/:id",
    { params: { id } },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
};

// Add book to collection
export const addBookToCollection = async (collectionId: string, bookId: string, accessToken: string) => {
  const response = await apiFetch(
    "POST /collection/:collectionId/books/:bookId",
    { params: { collectionId, bookId } },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
};

// Remove book from collection
export const removeBookFromCollection = async (collectionId: string, bookId: string, accessToken: string) => {
  const response = await apiFetch(
    "DELETE /collection/:collectionId/books/:bookId",
    { params: { collectionId, bookId } },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
}; 