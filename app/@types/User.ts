export interface User {
  id: number
  name: string
  email: string
  token?: string
  avatar?: { url?: string }
  role: 'admin' | 'user'
  firstLogin?: boolean
}