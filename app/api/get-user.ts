import type { ProfileResponse } from "~/api/schema"

export default async function getUser(): Promise<ProfileResponse | null> {
  try {
    const data = await useAPIClient<ProfileResponse>(`/user`, {
      method: 'GET',
    })
    return data ?? null
  } catch (error) {
    console.error('getProfile error:', error)
    return null
  }
}
