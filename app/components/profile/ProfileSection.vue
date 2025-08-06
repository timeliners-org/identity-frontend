<template>
  <div class="space-y-4">
    <h3 class="section-title text-gray-900 dark:text-gray-100">
      <i :class="iconClass" />
      {{ title }}
    </h3>
    <div class="space-y-3">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  iconClass: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: color 0.2s ease-in-out;
}

/* Fallback for dark theme support with higher specificity */
:global(.dark-theme) .section-title,
:global(html.dark) .section-title,
:global([data-theme="dark"]) .section-title {
  color: #f9fafb !important;
}

.section-title i {
  transition: color 0.2s ease-in-out;
}

/* Ensure icon colors work in dark mode too */
:global(.dark-theme) .section-title i,
:global(html.dark) .section-title i,
:global([data-theme="dark"]) .section-title i {
  color: #818cf8 !important;
}
</style>
