<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'shortcut icon', href: '/favicon.ico' }
  ],
  meta: [{ property: "og:title", content: `App Name - ${route.meta.title}` }],
})
</script>
