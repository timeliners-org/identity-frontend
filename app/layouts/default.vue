<template>
  <div class="app-layout">
    <!-- Theme toggle in top-right corner -->
    <div class="fixed top-4 right-4 z-10">
      <ThemeToggle />
    </div>

    <slot />
  </div>
</template>

<script lang="ts" setup>

</script>

<style>
/* Global styles for dark theme support */
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}

html.dark-theme {
  background-color: #111827;
  color: #f9fafb;
}

html.dark-theme body {
  background-color: #111827;
  color: #f9fafb;
}

.app-layout {
  min-height: 100vh;
}
</style>
