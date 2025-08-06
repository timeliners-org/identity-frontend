import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import ToastService from 'primevue/toastservice'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import { defineNuxtPlugin } from 'nuxt/app'
import Aura from '@primeuix/themes/aura'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark-theme',
      }
    }
  })
  nuxtApp.vueApp.use(ToastService)

  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('InputText', InputText)
  nuxtApp.vueApp.component('Password', Password)
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('Toast', Toast)
  nuxtApp.vueApp.component('ProgressSpinner', ProgressSpinner)
})
