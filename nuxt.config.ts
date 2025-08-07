import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/test-utils', '@nuxtjs/tailwindcss'],
  app: {
    head: {
      titleTemplate: '%s',
      title: 'Identity Frontend',
      meta: [
        { name: 'description', content: 'Modern authentication frontend application' }
      ]
    }
  },
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
    // Simplified production proxy configuration
    routeRules: {
      '/api/**': {
        proxy: `${process.env.API_BASE_URL || 'http://host.docker.internal:3000'}/**`
      }
    }
  },
})