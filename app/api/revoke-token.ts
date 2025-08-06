export default async function revokeToken(refreshToken: string): Promise<void> {
  try {
    await useAPIClient('/auth/revoke-token', {
      method: 'POST',
      body: { refreshToken },
    })
  } catch (error) {
    console.error('revokeToken error:', error)
  }
}