<template>
  <div class="mt-6 text-center space-y-4">
    <!-- Toggle between login/register -->
    <div class="text-sm">
      <span class="text-gray-600 dark:text-gray-400">
        {{
          mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"
        }}
      </span>
      <NuxtLink
        :to="mode === 'login' ? '/register' : '/login'"
        class="ml-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200"
      >
        {{ mode === "login" ? "Sign up" : "Sign in" }}
      </NuxtLink>
    </div>

    <!-- Additional links for login -->
    <div v-if="mode === 'login'" class="text-sm">
      <a
        href="#"
        class="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
        @click.prevent
      >
        Forgot your password?
      </a>
    </div>

    <!-- Terms and privacy for register -->
    <div
      v-if="mode === 'register'"
      class="text-xs text-gray-500 dark:text-gray-400"
    >
      By creating an account, you agree to our
      <a href="#" class="text-indigo-600 dark:text-indigo-400 hover:underline"
        >Terms of Service</a
      >
      and
      <a href="#" class="text-indigo-600 dark:text-indigo-400 hover:underline"
        >Privacy Policy</a
      >
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
