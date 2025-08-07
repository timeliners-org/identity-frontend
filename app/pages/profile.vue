<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4 relative"
  >
    <div class="max-w-4xl mx-auto">
      <!-- Navigation Header -->
      <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 mb-6 profile-card"
      >
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            User Profile
          </h1>
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            size="small"
            class="bg-red-500 hover:bg-red-600 border-0"
            @click="handleLogout"
          />
        </div>
      </div>

      <!-- Profile Information Card -->
      <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 profile-card"
      >
        <div v-if="user" class="space-y-6">
          <!-- User Avatar Section -->
          <div
            class="text-center pb-6 border-b border-gray-200 dark:border-gray-600"
          >
            <div
              class="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              <i class="pi pi-user text-white text-4xl" />
            </div>
            <h2
              class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2"
            >
              {{ user.username }}
            </h2>
            <div class="flex items-center justify-center gap-2">
              <span class="text-gray-600 dark:text-gray-300">{{
                user.email
              }}</span>
              <div v-if="user.isVerified" class="flex items-center gap-1">
                <i class="pi pi-verified text-green-500" />
                <span
                  class="text-green-600 dark:text-green-400 text-sm font-medium"
                  >Verified</span
                >
              </div>
              <div v-else class="flex items-center gap-1">
                <i class="pi pi-exclamation-triangle text-orange-500" />
                <span
                  class="text-orange-600 dark:text-orange-400 text-sm font-medium"
                  >Not Verified</span
                >
              </div>
            </div>
          </div>

          <!-- User Details Grid -->
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Basic Information -->
            <ProfileSection
              title="Basic Information"
              icon-class="pi pi-info-circle text-indigo-500"
            >
              <ProfileInfoCard
                label="User ID"
                type="text"
                :value="user.id"
                :monospace="true"
              />
              <ProfileInfoCard
                label="Username"
                type="text"
                :value="user.username"
              />
              <ProfileInfoCard
                label="Email Address"
                type="text"
                :value="user.email"
              />
            </ProfileSection>

            <!-- Account Status & Groups -->
            <ProfileSection
              title="Account Status"
              icon-class="pi pi-shield text-indigo-500"
            >
              <ProfileInfoCard
                label="Verification Status"
                type="status"
                :is-verified="user.isVerified"
              />
              <ProfileInfoCard
                label="Groups & Permissions"
                type="groups"
                :groups="user.groups"
              />
            </ProfileSection>
          </div>

          <!-- Actions Section -->
          <div class="pt-6 border-t border-gray-200 dark:border-gray-600">
            <h3
              class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2"
            >
              <i class="pi pi-cog text-indigo-500" />
              Account Actions
            </h3>
            <div class="flex flex-wrap gap-3">
              <Button
                label="Refresh Profile"
                icon="pi pi-refresh"
                :loading="isRefreshing"
                class="bg-indigo-500 hover:bg-indigo-600 border-0"
                @click="refreshProfile"
              />
              <Button
                label="Change Password"
                icon="pi pi-key"
                class="bg-gray-500 hover:bg-gray-600 border-0"
                disabled
              />
              <Button
                label="Account Settings"
                icon="pi pi-cog"
                class="bg-gray-500 hover:bg-gray-600 border-0"
                disabled
              />
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="isLoading" class="text-center py-12">
          <ProgressSpinner />
          <p class="text-gray-600 dark:text-gray-300 mt-4">
            Loading profile...
          </p>
        </div>

        <!-- Error State -->
        <div v-else class="text-center py-12">
          <i class="pi pi-exclamation-triangle text-red-500 text-6xl mb-4" />
          <h3
            class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
          >
            Unable to load profile
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Please try refreshing the page or log in again.
          </p>
          <Button
            label="Go to Login"
            icon="pi pi-sign-in"
            class="bg-indigo-500 hover:bg-indigo-600 border-0"
            @click="goToLogin"
          />
        </div>
      </div>

      <!-- Debug Information (nur in Development) -->
      <div
        v-if="isDevelopment"
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 mt-6 profile-card"
      >
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2"
        >
          <i class="pi pi-code text-orange-500" />
          Debug Information (Development Only)
        </h3>
        <div
          class="bg-gray-900 dark:bg-gray-950 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto"
        >
          <pre>{{
            JSON.stringify({ user, isLoading, isRefreshing }, null, 2)
          }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuth } from "../composables/useAuth";
import { useRouter } from "vue-router";

// Reactive data
const router = useRouter();
const auth = useAuth();
const isLoading = ref(true);
const isRefreshing = ref(false);

// Computed properties
const user = computed(() => auth.user.value);
const isDevelopment = computed(() => false); // Always show in development, can be disabled later

// Methods
const handleLogout = async () => {
  try {
    await auth.logout();
    await router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const refreshProfile = async () => {
  try {
    isRefreshing.value = true;
    await auth.fetchUser();
  } catch (error) {
    console.error("Failed to refresh profile:", error);
  } finally {
    isRefreshing.value = false;
  }
};

const goToLogin = () => {
  router.push("/login");
};

// Lifecycle
onMounted(async () => {
  try {
    // Check if user is logged in, if not redirect to login
    if (!auth.user.value) {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      if (!token) {
        await router.push("/login");
        return;
      }
      await auth.fetchUser();
      if (!auth.user.value) {
        await router.push("/login");
        return;
      }
    }
  } catch (error) {
    console.error("Failed to load user profile:", error);
    await router.push("/login");
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
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

.profile-card {
  animation: fadeIn 0.6s ease-out;
}

/* Dark theme support */
:global(.dark-theme) .min-h-screen {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

:global(.dark-theme) .profile-card {
  background-color: rgba(31, 41, 55, 0.95) !important;
  border-color: rgba(75, 85, 99, 0.5) !important;
  color: #f9fafb;
}

/* PrimeVue Button Customization */
:deep(.p-button) {
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}

:deep(.p-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Progress Spinner Customization */
:deep(.p-progress-spinner) {
  width: 3rem;
  height: 3rem;
}

:deep(.p-progress-spinner .p-progress-spinner-circle) {
  stroke: #6366f1;
}
</style>
