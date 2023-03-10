import useMatchesData from "./useMatchesData"

export interface User {
  id: number
  name: string
  email: string
  token?: string
}

export default function useUser() {
  const { user } = useMatchesData<{ user: User }>('root')

  return user
}