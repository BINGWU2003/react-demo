
export interface User {
  name: string;
  email: string;
  id?: string;
}

export interface UserItem extends User {
  created_at: Date;
  updated_at: Date;
}

