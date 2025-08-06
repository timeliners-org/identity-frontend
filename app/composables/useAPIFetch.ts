import { useTokenRefresh } from "./useTokenRefresh"

// Check if token needs refresh and refresh it
async function ensureValidToken(): Promise<void> {
  if (!import.meta.client) return

  const tokenExpiresAt = localStorage.getItem('token_expires_at')
  const refreshTokenValue = localStorage.getItem('refresh_token')

  if (!tokenExpiresAt || !refreshTokenValue) return

  const expirationTime = parseInt(tokenExpiresAt)
  const now = Date.now()

  // If token expires in less than 5 minutes, refresh it
  if (now >= expirationTime - (5 * 60 * 1000)) {
    try {
      // Use direct $fetch to avoid circular dependency with useAPIClient
      const config = useRuntimeConfig()
      const data = await $fetch(`${config.public.apiBaseUrl}/auth/refresh-token`, {
        method: 'POST',
        body: {
          refreshToken: refreshTokenValue
        }
      })

      if (data && (data as any).tokens) {
        const tokens = (data as any).tokens
        localStorage.setItem('access_token', tokens.accessToken)
        localStorage.setItem('refresh_token', tokens.refreshToken)

        // Calculate new expiration time (15 minutes from now)
        const newExpirationTime = Date.now() + (15 * 60 * 1000)
        localStorage.setItem('token_expires_at', newExpirationTime.toString())
      } else {
        // Only logout if refresh actually failed (no data returned)
        console.error('Token refresh failed: No data returned')
        const { logout } = useTokenRefresh()
        await logout()
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      // Only logout on actual error
      const { logout } = useTokenRefresh()
      await logout()
    }
  }
}

// Server-side fetch using useFetch (for SSR)
export function useAPIFetch<T>(path: string, options: any = {}) {
  const config = useRuntimeConfig()

  // Automatically add the Authorization header if the user is logged in
  // Only access localStorage on client side
  const token = import.meta.client ? localStorage.getItem('access_token') : null
  options.headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  return useFetch<T>(`${config.public.apiBaseUrl}${path}`, options)
}

// Client-side fetch using $fetch (for mounted components)
export async function useAPIClient<T>(path: string, options: any = {}, noValidation: boolean = false): Promise<T> {
  const config = useRuntimeConfig()

  // Ensure token is valid before making request
  if (!noValidation) {
    await ensureValidToken()
  }

  // Automatically add the Authorization header if the user is logged in
  const token = import.meta.client ? localStorage.getItem('access_token') : null
  options.headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  return await $fetch<T>(`${config.public.apiBaseUrl}${path}`, options)
}
