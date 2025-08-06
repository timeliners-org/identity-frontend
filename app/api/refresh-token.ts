import type { RefreshTokenResponse } from "~/api/schema"

export default async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse | null> {
  try {
    const data = await useAPIClient<RefreshTokenResponse>('/auth/refresh-token', {
      method: 'POST',
      body: {
        refreshToken
      }
    }, true // no validation for refresh token endpoint
    );
    return data ?? null
  } catch (error) {
    console.error('refreshToken error:', error)
  }
  return null
}