import getApi from "./getApi";

export default async function withAuth() {
  const api = await getApi()

  try {
    const response = await api.get('/me')
  
    return response.data
  } catch {
    return null
  }
}