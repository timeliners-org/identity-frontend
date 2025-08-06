import { ref, onMounted, readonly, computed } from 'vue'
import { themeConfig, type Theme } from '~/config/theme'

// Global state - shared across all instances
const currentTheme = ref<Theme>('system')
const isDarkMode = ref(false)

export const useTheme = () => {
  const isDark = readonly(isDarkMode)
  const theme = readonly(currentTheme)

  const toggleTheme = () => {
    const newTheme = isDarkMode.value ? 'light' : 'dark'
    setTheme(newTheme)
  }

  const setTheme = (newTheme: Theme) => {
    currentTheme.value = newTheme
    updateTheme()
  }

  const updateTheme = () => {
    if (!import.meta.client) return

    const html = document.documentElement

    // Determine if should be dark
    let shouldBeDark = false

    if (currentTheme.value === 'dark') {
      shouldBeDark = true
    } else if (currentTheme.value === 'light') {
      shouldBeDark = false
    } else { // system
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    // Update DOM
    if (shouldBeDark) {
      html.classList.add(themeConfig.cssClass)
    } else {
      html.classList.remove(themeConfig.cssClass)
    }

    // Update refs
    isDarkMode.value = shouldBeDark

    // Save to localStorage
    localStorage.setItem(themeConfig.storageKey, currentTheme.value)
  }

  const initTheme = () => {
    if (!import.meta.client) return

    // Check if theme is already set (by inline script)
    const hasThemeClass = document.documentElement.classList.contains(themeConfig.cssClass)

    // Get saved theme or use default
    const savedTheme = localStorage.getItem(themeConfig.storageKey) as Theme
    currentTheme.value = savedTheme || themeConfig.defaultTheme

    // Determine current dark mode state
    if (currentTheme.value === 'system') {
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      isDarkMode.value = currentTheme.value === 'dark'
    }

    // Only update DOM if not already correctly set by inline script
    if (hasThemeClass !== isDarkMode.value) {
      updateTheme()
    }
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only respond to system changes if current theme is 'system'
      if (currentTheme.value === 'system') {
        isDarkMode.value = e.matches
        updateTheme()
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // Cleanup function (though not used in this context)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }

  // Computed properties for convenience
  const isSystemTheme = computed(() => currentTheme.value === 'system')
  const effectiveTheme = computed(() => {
    if (currentTheme.value === 'system') {
      return isDarkMode.value ? 'dark' : 'light'
    }
    return currentTheme.value
  })

  // Initialize theme when composable is first used
  if (import.meta.client && !document.documentElement.hasAttribute('data-theme-initialized')) {
    initTheme()
    document.documentElement.setAttribute('data-theme-initialized', 'true')
  }

  onMounted(() => {
    // Ensure theme is initialized even if not done above
    if (!document.documentElement.hasAttribute('data-theme-initialized')) {
      initTheme()
      document.documentElement.setAttribute('data-theme-initialized', 'true')
    }
  })

  return {
    isDark,
    theme,
    isSystemTheme,
    effectiveTheme,
    toggleTheme,
    setTheme,
    initTheme,
    updateTheme
  }
}
