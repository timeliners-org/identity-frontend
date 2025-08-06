<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4 relative"
  >

    <div
      class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md border border-white/20 dark:border-gray-600/50 auth-container"
    >
      <AuthHeader mode="register" />
      <AuthForm mode="register" />
      <AuthLinks mode="register" />
    </div>
  </div>
</template>

<script setup lang="ts">
// This is a registration page - no auth required
</script>

<style scoped>
/* Animation */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-container {
  animation: slideInUp 0.5s ease-out;
}

/* Dark theme gradient override */
:global(.dark-theme) .min-h-screen {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}
</style>
