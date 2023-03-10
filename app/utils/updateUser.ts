import { commitAuthSession, getAuthSession } from "~/cookies/auth.cookie";
import type { User } from "./hooks/useUser";

export default async function updateUser(request: Request, user: User) {
  const authSession = await getAuthSession(
    request.headers.get("Cookie")
  );
  
  authSession.set('user', { token: authSession.data.user.token, ...user })

  const headers = new Headers()
  headers.append('Set-Cookie', await commitAuthSession(authSession))

  return headers
} 