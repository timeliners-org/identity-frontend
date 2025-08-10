import type { ChangePasswordResponse } from "~/api/schema"
import { useAPIClient } from "~/composables/useAPIFetch"

export default async function changePassword(oldPassword: string, newPassword: string): Promise<ChangePasswordResponse | null> {
  try {
    const data = await useAPIClient<ChangePasswordResponse>(`/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    })
    return data ?? null
  } catch (error) {
    console.error('changePassword error:', error)
    return null
  }
}
