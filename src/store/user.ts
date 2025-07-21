import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { LoginInfo } from '../types/user'



interface UserState {
  loginInfo: LoginInfo
  setLoginInfo: (loginInfo: LoginInfo) => void
}


export const useUserStore = create<UserState>()(persist((set) => ({
  loginInfo: {
    user: {
      id: '',
      name: '',
      email: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    token: ''
  },
  setLoginInfo: (loginInfo: LoginInfo) => set({ loginInfo })
}), {
  name: 'user-storage',
  storage: createJSONStorage(() => localStorage)
})) 