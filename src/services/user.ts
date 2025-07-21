import request from '../utils/request';
import type { User, UserItem, LoginInfo } from '../types/user'
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


export const registerUser = async (data: User) => {
  return await request.post<User>('/api/users/register', data)
}

export const loginUser = async (data: { email: string, password: string }) => {
  return await request.post<LoginInfo>('/api/users/login', data)
}

export const getUserProfile = async () => {
  return await request.get<UserItem>('/api/users/profile')
}
