import request from '../utils/request';
import type { Book } from '../types/book'
import type { Query, ListResponse } from '../types/params';
export const createBook = async (data: Book) => {
  return await request.post<Book>('/api/books', data)
}

export const getBookList = async (params: Query) => {
  return await request.get<ListResponse<Book>>('/api/books', { params })
}

export const deleteBook = async (id: number) => {
  return await request.delete<Book>(`/api/books/${id}`)
}