import revokeToken from "~/api/revoke-token";

export const useTokenRefresh = () => {
  const user = useState<any>('user')

  const logout = async () => {
    const refreshTokenValue = localStorage.getItem('refresh_token')
    if (refreshTokenValue) {
      await revokeToken(refreshTokenValue)
    }

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('token_expires_at')
    user.value = null

    // Navigate to login page
    await navigateTo('/login')
  }

  return {
    logout
  }
}
