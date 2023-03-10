import getApi from "./api";
import getAuthToken from "./getAuthToken";

export default async function withAuth(request: Request) {
  const api = await getApi()
  const token = await getAuthToken(request)

  const response = await api.get('/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return response.data
}