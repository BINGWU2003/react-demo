import request from '../utils/request';
import type { User, UserItem } from '../types/user'
import type { Query, ListResponse } from '../types/params';
export const createUser = async (data: User) => {
  return await request.post<UserItem>('/api/users', data)
}

export const getUserList = async (params: Query) => {
  return await request.get<ListResponse<UserItem>>('/api/users', { params })
}

export const updateUser = async (params: UserItem) => {
  return await request.put<UserItem>(`/api/users/${params.id}`, {
    name: params.name,
    email: params.email
  })
}

export const deleteUser = async (id: string) => {
  return await request.delete<UserItem>(`/api/users/${id}`, {
    params: {
      id
    }
  })
}