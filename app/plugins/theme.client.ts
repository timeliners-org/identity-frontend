import { themeConfig } from '~/config/theme'

export default defineNuxtPlugin(() => {
  // Inline script to prevent flash of wrong theme
  if (import.meta.client) {
    const script = `
      (function() {
        const storageKey = '${themeConfig.storageKey}';
        const cssClass = '${themeConfig.cssClass}';
        const defaultTheme = '${themeConfig.defaultTheme}';
        
        function getThemePreference() {
          const saved = localStorage.getItem(storageKey);
          if (saved && saved !== 'system') return saved;
          
          if (defaultTheme === 'system' || !saved) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          }
          
          return defaultTheme;
        }
        
        const theme = getThemePreference();
        if (theme === 'dark') {
          document.documentElement.classList.add(cssClass);
        }
      })();
    `;

    // Only add if not already present
    if (!document.querySelector('script[data-theme-init]')) {
      const scriptElement = document.createElement('script')
      scriptElement.setAttribute('data-theme-init', 'true')
      scriptElement.textContent = script
      document.head.appendChild(scriptElement)
    }
  }
})
