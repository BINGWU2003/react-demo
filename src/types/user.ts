
export interface User {
  name: string;
  email: string;
  id?: string;
  password?: string;
}

export interface UserItem extends User {
  created_at: Date;
  updated_at: Date;
}


export interface LoginInfo {
  user: UserItem
  token: string
}