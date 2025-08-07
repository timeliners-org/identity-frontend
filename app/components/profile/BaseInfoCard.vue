<template>
  <div class="info-card">
    <label class="info-label">{{ label }}</label>
    <div class="info-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.info-card {
  background-color: rgb(249 250 251);
  border: 1px solid rgb(229 231 235);
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s ease-in-out;
}

:global(.dark) .info-card {
  background-color: rgba(55, 65, 81, 0.5);
  border-color: rgb(75 85 99);
}

.info-card:hover {
  border-color: rgb(165 180 252);
}

:global(.dark) .info-card:hover {
  border-color: rgb(99 102 241);
}

.info-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(55 65 81);
  margin-bottom: 0.5rem;
}

:global(.dark) .info-label {
  color: rgb(209 213 219);
}

.info-content {
  color: rgb(17 24 39);
}

:global(.dark) .info-content {
  color: rgb(243 244 246);
}
</style>
