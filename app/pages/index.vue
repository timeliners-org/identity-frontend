<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4 relative"
  >
    <div
      class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md text-center"
    >
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Identity Frontend
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Welcome to your authentication portal
        </p>
      </div>

      <div class="space-y-4">
        <div v-if="auth.loggedIn.value" class="space-y-4">
          <div
            class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4"
          >
            <div class="flex items-center gap-2 mb-2">
              <i class="pi pi-check-circle text-green-500" />
              <span class="text-green-800 dark:text-green-200 font-medium"
                >You are logged in</span
              >
            </div>
            <p class="text-green-700 dark:text-green-300 text-sm">
              Welcome back, {{ auth.user.value?.username }}!
            </p>
          </div>

          <Button
            label="Go to Profile"
            icon="pi pi-user"
            class="w-full bg-indigo-500 hover:bg-indigo-600 border-0"
            size="large"
            @click="router.push('/profile')"
          />

          <Button
            label="Logout"
            icon="pi pi-sign-out"
            class="w-full bg-red-500 hover:bg-red-600 border-0"
            size="large"
            outlined
            @click="handleLogout"
          />
        </div>

        <div v-else class="space-y-4">
          <div
            class="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
          >
            <div class="flex items-center gap-2 mb-2">
              <i class="pi pi-info-circle text-gray-500 dark:text-gray-400" />
              <span class="text-gray-800 dark:text-gray-200 font-medium"
                >Not logged in</span
              >
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Please log in to access your profile
            </p>
          </div>

          <Button
            label="Login"
            icon="pi pi-sign-in"
            class="w-full bg-indigo-500 hover:bg-indigo-600 border-0"
            size="large"
            @click="router.push('/login')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "../composables/useAuth";

// Set page meta
definePageMeta({
  title: "Home - Identity Frontend",
});

const auth = useAuth();
const router = useRouter();

const handleLogout = async () => {
  try {
    await auth.logout();
    // Stay on home page after logout
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// Check for existing token on page load
onMounted(async () => {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (token && !auth.user.value) {
      await auth.fetchUser();
    }
  } catch (error) {
    console.error("Failed to fetch user on home page:", error);
  }
});
</script>

<style scoped>
/* Button hover effects */
:deep(.p-button) {
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}

:deep(.p-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white\/95 {
  animation: fadeIn 0.6s ease-out;
}
</style>
