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
          <div class="flex items-center gap-3">
            <Button icon="pi pi-arrow-left" text size="small" @click="goBack" />
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Edit Profile
            </h1>
          </div>
          <div class="flex gap-2">
            <Button
              label="Save Changes"
              icon="pi pi-save"
              size="small"
              :disabled="!hasChanges || isSaving"
              :loading="isSaving"
              class="bg-green-500 hover:bg-green-600 border-0"
              @click="saveAllChanges"
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              size="small"
              severity="secondary"
              @click="goBack"
            />
          </div>
        </div>
      </div>

      <!-- Edit Profile Form -->
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
              {{ editedData.username || user.username }}
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

          <!-- Editable Fields -->
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
              <EditableInfoCard
                v-model="editedData.username"
                label="Username"
                placeholder="Enter your username"
                @save="updateUsername"
              />
              <ProfileInfoCard
                label="Email Address"
                type="text"
                :value="user.email"
              />
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <i class="pi pi-info-circle mr-1" />
                Email cannot be changed from this interface
              </div>
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
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <i class="pi pi-info-circle mr-1" />
                Account status and groups are managed by administrators
              </div>
            </ProfileSection>
          </div>

          <!-- Change Summary -->
          <div
            v-if="hasChanges"
            class="pt-6 border-t border-gray-200 dark:border-gray-600"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2"
            >
              <i class="pi pi-exclamation-triangle text-orange-500" />
              Pending Changes
            </h3>
            <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <ul
                class="text-sm text-orange-800 dark:text-orange-300 space-y-1"
              >
                <li
                  v-if="editedData.username !== user.username"
                  class="flex items-center gap-2"
                >
                  <i class="pi pi-arrow-right text-xs" />
                  Username: "{{ user.username }}" → "{{ editedData.username }}"
                </li>
              </ul>
              <div class="mt-3 flex gap-2">
                <Button
                  label="Save All Changes"
                  icon="pi pi-save"
                  size="small"
                  :loading="isSaving"
                  class="bg-green-500 hover:bg-green-600 border-0"
                  @click="saveAllChanges"
                />
                <Button
                  label="Discard Changes"
                  icon="pi pi-undo"
                  size="small"
                  severity="secondary"
                  @click="discardChanges"
                />
              </div>
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
            label="Go to Profile"
            icon="pi pi-user"
            class="bg-indigo-500 hover:bg-indigo-600 border-0"
            @click="goToProfile"
          />
        </div>
      </div>

      <!-- Debug Information (nur in Development) -->
      <div
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
            JSON.stringify(
              {
                user: user,
                isLoading: isLoading,
                isSaving: isSaving,
                authUser: auth.user.value,
                editedData: editedData,
                originalData: originalData,
                hasChanges: hasChanges,
              },
              null,
              2
            )
          }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { useAuth } from "../composables/useAuth";
import { useRouter } from "vue-router";
import updateUser from "../api/update-user";

// Reactive data
const router = useRouter();
const auth = useAuth();
const isLoading = ref(true);
const isSaving = ref(false);

// Editable data
const editedData = reactive({
  username: "",
});

// Original data for comparison
const originalData = ref({
  username: "",
});

// Computed properties
const user = computed(() => auth.user.value);
const hasChanges = computed(() => {
  return editedData.username !== originalData.value.username;
});

// Methods
const goBack = () => {
  if (hasChanges.value) {
    const confirmed = confirm(
      "You have unsaved changes. Are you sure you want to leave?"
    );
    if (!confirmed) return;
  }
  router.push("/profile");
};

const goToProfile = () => {
  router.push("/profile");
};

const discardChanges = () => {
  editedData.username = originalData.value.username;
};

// @ts-ignore
const updateUsername = async (newUsername) => {
  if (!newUsername.trim()) {
    throw new Error("Username cannot be empty");
  }

  if (newUsername === user.value?.username) {
    return; // No change needed
  }

  // Update local data immediately for UI responsiveness
  editedData.username = newUsername;
};

const saveAllChanges = async () => {
  if (!hasChanges.value) return;

  isSaving.value = true;
  try {
    // Create update object with only changed fields
    const updateData = {};

    if (editedData.username !== originalData.value.username) {
      Object.assign(updateData, { username: editedData.username.trim() });
    }

    if (Object.keys(updateData).length === 0) {
      isSaving.value = false;
      return;
    }

    const result = await updateUser(updateData);

    if (result?.success) {
      // Update auth state with new user data
      if (result.user) {
        auth.user.value = result.user;
      }

      // Update original data to reflect saved state
      originalData.value.username = editedData.username;

      // Show success message
      // You could add a toast notification here
      console.log("Profile updated successfully:", result.message);

      // Redirect to profile page
      await router.push("/profile");
    } else {
      throw new Error(result?.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("Failed to save changes:", error);
    // You could add error toast notification here
    alert("Failed to save changes. Please try again.");
  } finally {
    isSaving.value = false;
  }
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

    // Initialize editable data
    const currentUser = auth.user.value;
    if (currentUser) {
      editedData.username = currentUser.username;
      originalData.value.username = currentUser.username;
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

:deep(.p-button:disabled) {
  transform: none;
  box-shadow: none;
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
