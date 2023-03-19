import type { User } from "~/@types/User"
import useMatchesData from "./useMatchesData"

export default function useUser() {
  const { user } = useMatchesData<{ user: User }>('routes/__root/dashboard')

  return user
}