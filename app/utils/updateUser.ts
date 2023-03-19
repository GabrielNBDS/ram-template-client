import type { User } from "~/@types/User";
import { commitAuthSession, getAuthSession } from "~/cookies/auth.cookie";

export default async function updateUser(request: Request, user: User) {
  const authSession = await getAuthSession(
    request.headers.get("Cookie")
  );
  
  authSession.set('user', { token: authSession.data.user.token, ...user })

  const headers = new Headers()
  headers.append('Set-Cookie', await commitAuthSession(authSession))

  return headers
} 