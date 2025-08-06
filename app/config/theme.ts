export interface ThemeConfig {
  storageKey: string
  cssClass: string
  defaultTheme: 'light' | 'dark' | 'system'
  transitions: {
    duration: string
    easing: string
  }
}

export const themeConfig: ThemeConfig = {
  storageKey: 'theme',
  cssClass: 'dark-theme',
  defaultTheme: 'system', // 'light', 'dark', or 'system'
  transitions: {
    duration: '0.2s',
    easing: 'ease'
  }
}

export type Theme = 'light' | 'dark' | 'system'
