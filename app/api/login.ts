import getUserId from "~/api/get-user-id";
import type { LoginResponse } from "~/api/schema";

export default async function login(identifier: string, password: string): Promise<LoginResponse | null> {
  const userID = await getUserId(identifier)
  if (!userID) {
    throw new Error("User not found")
  }
  try {
    const data = await useAPIClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { id: userID.userId, password: password },
    })
    return data ?? null
  } catch (error) {
    console.error('login error:', error)
    throw error
  }
}