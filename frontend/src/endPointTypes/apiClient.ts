// frontend/src/endPointTypes/apiClient.ts

import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

import {ApiResponseTypes, Endpoint, endpointMap} from './endpointMap';
import {ArrowElement, Book, Highlight, ObjectId, RectElement, StartType, TextElement} from './types';

// Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api',  // Adjust base URL as needed
});

// Generic fetch function accepting the endpoint key directly
export async function apiFetch<K extends Endpoint>(
    key: K,
    config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponseTypes[K]>> {
  const [method, ...pathParts] = key.split(' ');
  const path = pathParts.join(' ');  // Join in case path contains spaces

  // Perform the Axios request with the inferred type
  const response = await axiosInstance.request<ApiResponseTypes[K]>({
    method,
    url: path,
    ...config,
  });

  return response;
}

// Example usage functions

// Fetch all books
export async function getBooks() {
  const response = await apiFetch('GET book');
  return response.data;
}

// Fetch user books
export async function getUserBooks() {
  const response = await apiFetch('GET book/getUserBooks');
  return response.data;
}

// Fetch a book by ID
export async function getBookById(id: string){
  const endpoint = `GET book/${id}` as const;
  const response = await apiFetch(endpoint);
  return response.data;
}

// Create a new book
export async function createBook(newBook: Partial<Book>){
  const response = await apiFetch('POST book', {data: newBook});
  return response.data;
}

// Update a book by ID
export async function updateBook(
    id: string, updatedData: Partial<Book>) {
  const endpoint = `PATCH /book/${id}` as const;
  const response = await apiFetch(endpoint, {data: updatedData});
  return response.data;
}

// Delete a book by ID
export async function deleteBook(id: string){
  const endpoint = `DELETE /book/${id}` as const;
  const response = await apiFetch(endpoint);
  return response.data;
}
