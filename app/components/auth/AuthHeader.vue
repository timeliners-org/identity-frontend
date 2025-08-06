<template>
  <div class="text-center mb-8">
    <div class="mb-6">
      <div
        class="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
      >
        <i class="pi pi-user text-white text-2xl" />
      </div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {{ mode === "login" ? "Welcome Back" : "Create Account" }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{
          mode === "login"
            ? "Sign in to access your account"
            : "Join us and start your journey"
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  mode: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
/* Animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.8;
  }
}

.w-16 {
  animation: pulse 2s ease-in-out infinite;
}
</style>
