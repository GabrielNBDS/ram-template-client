import { getAuthSession } from '~/cookies/auth.cookie';

export default async function getAuthToken(request: Request) {
  const authSession = await getAuthSession(
    request.headers.get("Cookie")
  );

  return authSession.data.user.token
}