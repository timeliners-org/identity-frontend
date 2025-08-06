// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/test-utils', '@nuxtjs/tailwindcss'],
  devServer: {
    port: 3001, // Update to the actual port being used
  },
  css: [
    'primeicons/primeicons.css',
    '~/assets/css/theme.css'
  ],
  build: {
    transpile: ['primevue'],
  },
  ssr: true,
  runtimeConfig: {
    public: {
      // Use environment variable or default to proxy path
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api',
    },
  },
  nitro: {
    devProxy: {
      '/api/**': {
        target: process.env.API_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    },
    routeRules: {
      '/api/**': { proxy: `${process.env.API_BASE_URL}/**` || 'http://localhost:3000/**' }
    }
  },
})