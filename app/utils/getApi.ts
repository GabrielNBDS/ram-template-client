import axios from 'axios';
import { getAuthSession } from '~/cookies/auth.cookie';

export default async function getApi(request?: Request) {
  let token: string | undefined;

  if(request) {
    const authSession = await getAuthSession(
      request.headers.get("Cookie")
    );

    token = authSession.data.user.token
  }

  const api = axios.create({
    baseURL: process.env.API_URL,
  });

  api.defaults.headers.common['Authorization'] = `Bearer ${token}`

  return api
}