import type { UpdateUserRequest, UpdateUserResponse } from "~/api/schema"

export default async function updateUser(updates: Partial<UpdateUserRequest>): Promise<UpdateUserResponse | null> {
  try {
    const data = await useAPIClient<UpdateUserResponse>(`/user`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    return data ?? null
  } catch (error) {
    console.error('updateUser error:', error)
    return null
  }
}
