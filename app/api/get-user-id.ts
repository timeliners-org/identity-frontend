import type { GetUserIDResponse } from "~/api/schema"

export default async function getUserId(identifier: string): Promise<GetUserIDResponse | null> {
  try {
    const data = await useAPIClient<GetUserIDResponse>(`/user/get-user-id`, {
      method: 'POST',
      body: { identifier },
    })
    return data ?? null
  } catch (error) {
    console.error('getUserId error:', error)
    return null
  }
}
