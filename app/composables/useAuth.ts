import apiLogin from "~/api/login";
import getProfile from "~/api/profile";
import revokeToken from "~/api/revoke-token";
import refreshTokenApi from "~/api/refresh-token";
import type { ProfileUser } from "~/utils/types";

export const useAuth = () => {
  const user = useState<ProfileUser | null>('user', () => null)

  const login = async (identifier: string, password: string) => {
    const data = await apiLogin(identifier, password)
    if (!data)
      throw new Error('Login failed')

    localStorage.setItem('access_token', data.tokens.accessToken)
    localStorage.setItem('refresh_token', data.tokens.refreshToken)

    // Calculate and store token expiration time (15 minutes from now)
    const expirationTime = Date.now() + (15 * 60 * 1000) // 15 minutes in milliseconds
    localStorage.setItem('token_expires_at', expirationTime.toString())
  }

  const logout = async () => {
    if (import.meta.client) {
      const { logout: tokenRefreshLogout } = useTokenRefresh()
      await tokenRefreshLogout()
    }
  }

  const fetchUser = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) return
    const data = await getProfile()
    user.value = data?.user ?? null
  }

  const refreshToken = async (): Promise<boolean> => {
    const refreshTokenValue = localStorage.getItem('refresh_token')
    if (!refreshTokenValue) return false

    try {
      const data = await refreshTokenApi(refreshTokenValue)
      if (data) {
        localStorage.setItem('access_token', data.tokens.accessToken)
        localStorage.setItem('refresh_token', data.tokens.refreshToken)

        // Calculate new expiration time (15 minutes from now)
        const newExpirationTime = Date.now() + (15 * 60 * 1000)
        localStorage.setItem('token_expires_at', newExpirationTime.toString())
        return true
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      if (import.meta.client) {
        const { logout: tokenRefreshLogout } = useTokenRefresh()
        await tokenRefreshLogout()
      }
    }
    return false
  }

  const isTokenExpired = (): boolean => {
    const tokenExpiresAt = localStorage.getItem('token_expires_at')
    if (!tokenExpiresAt) return true

    const expirationTime = parseInt(tokenExpiresAt)
    const now = Date.now()

    return now >= expirationTime
  }

  return {
    user,
    login,
    logout,
    fetchUser,
    refreshToken,
    isTokenExpired,
    loggedIn: computed(() => !!user.value),
  }
}
