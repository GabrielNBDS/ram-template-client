import getApi from "./api";

export default async function withAuth(request: Request) {
  const api = await getApi()

  try {
    const response = await api.get('/me')
  
    return response.data
  } catch {
    return null
  }
}