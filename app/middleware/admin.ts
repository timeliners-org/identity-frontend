export default defineNuxtRouteMiddleware(() => {
  const auth = useAuth()
  if (!auth.loggedIn || auth.user?.value?.groups.includes('admin') === false) {
    return navigateTo('/login')
  }
})
