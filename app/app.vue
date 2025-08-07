<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Theme wird automatisch durch das Plugin initialisiert

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'shortcut icon', href: '/favicon.ico' }
  ]
})
</script>
