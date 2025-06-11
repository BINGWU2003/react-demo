export interface Query {
  page: number,
  limit: number
}

export interface Pagination {
  page: number,
  limit: number,
  total: number,
  totalPages: number
}

export interface ListResponse<T> {
  list: T[],
  pagination: Pagination
}

