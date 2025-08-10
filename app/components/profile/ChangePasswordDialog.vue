<template>
  <Dialog
    :visible="visible"
    modal
    header="Change Password"
    :style="{ width: '450px' }"
    :closable="!isLoading"
    :draggable="false"
    class="change-password-dialog"
    @update:visible="emit('update:visible', $event)"
  >
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Current Password field -->
      <div class="space-y-2">
        <label
          for="currentPassword"
          class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          Current Password
        </label>
        <div class="relative">
          <ClientOnly>
            <Password
              id="currentPassword"
              v-model="currentPassword"
              placeholder="Enter your current password"
              toggle-mask
              :feedback="false"
              class="w-full password-field"
              :class="{ 'password-error': formError }"
              :disabled="isLoading"
            />
            <template #fallback>
              <InputText
                id="currentPassword"
                v-model="currentPassword"
                type="password"
                placeholder="Enter your current password"
                class="w-full h-12 pl-4 pr-4 text-base border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                :class="{
                  'border-red-500 focus:border-red-500 focus:ring-red-200': formError,
                }"
                :disabled="isLoading"
              />
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- New Password field -->
      <div class="space-y-2">
        <label
          for="newPassword"
          class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          New Password
        </label>
        <div class="relative">
          <ClientOnly>
            <Password
              id="newPassword"
              v-model="newPassword"
              placeholder="Enter your new password"
              toggle-mask
              :feedback="true"
              prompt-label="Choose a password"
              weak-label="Weak password"
              medium-label="Medium password"
              strong-label="Strong password"
              class="w-full password-field"
              :class="{ 'password-error': formError }"
              :disabled="isLoading"
            />
            <template #fallback>
              <InputText
                id="newPassword"
                v-model="newPassword"
                type="password"
                placeholder="Enter your new password"
                class="w-full h-12 pl-4 pr-4 text-base border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                :class="{
                  'border-red-500 focus:border-red-500 focus:ring-red-200': formError,
                }"
                :disabled="isLoading"
              />
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- Confirm New Password field -->
      <div class="space-y-2">
        <label
          for="confirmPassword"
          class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          Confirm New Password
        </label>
        <div class="relative">
          <ClientOnly>
            <Password
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="Confirm your new password"
              toggle-mask
              :feedback="false"
              class="w-full password-field"
              :class="{ 'password-error': formError || passwordMismatch }"
              :disabled="isLoading"
            />
            <template #fallback>
              <InputText
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                class="w-full h-12 pl-4 pr-4 text-base border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                :class="{
                  'border-red-500 focus:border-red-500 focus:ring-red-200': formError || passwordMismatch,
                }"
                :disabled="isLoading"
              />
            </template>
          </ClientOnly>
        </div>
        <div v-if="passwordMismatch" class="text-red-500 text-sm">
          Passwords do not match
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="formError" class="text-red-500 text-sm text-center">
        {{ formError }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="text-green-500 text-sm text-center">
        {{ successMessage }}
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          label="Cancel"
          icon="pi pi-times"
          text
          :disabled="isLoading"
          @click="handleCancel"
        />
        <Button
          label="Change Password"
          icon="pi pi-key"
          :loading="isLoading"
          :disabled="!isFormValid"
          class="bg-indigo-500 hover:bg-indigo-600 border-0"
          @click="handleSubmit"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import changePassword from "~/api/change-password";

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
});

// Emits
const emit = defineEmits(['update:visible', 'success']);

// Reactive data
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const formError = ref("");
const successMessage = ref("");

// Computed properties
const passwordMismatch = computed(() => {
  return confirmPassword.value && newPassword.value !== confirmPassword.value;
});

const isFormValid = computed(() => {
  return (
    currentPassword.value &&
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value === confirmPassword.value &&
    newPassword.value.length >= 6 // Minimum password length
  );
});

// Methods
const handleSubmit = async () => {
  if (!isFormValid.value) return;

  formError.value = "";
  successMessage.value = "";
  isLoading.value = true;

  try {
    const result = await changePassword(currentPassword.value, newPassword.value);

    if (result) {
      successMessage.value = result.message || "Password changed successfully!";
      
      // Reset form after success
      setTimeout(() => {
        resetForm();
        emit("update:visible", false);
        emit("success");
      }, 1500);
    } else {
      formError.value = "Failed to change password. Please check your current password.";
    }
  } catch (error) {
    console.error("Change password error:", error);
    formError.value = error.message || "An error occurred while changing password.";
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  resetForm();
  emit("update:visible", false);
};

const resetForm = () => {
  currentPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  formError.value = "";
  successMessage.value = "";
  isLoading.value = false;
};

// Watch for dialog visibility changes to reset form
watch(
  () => props.visible,
  (newValue) => {
    if (!newValue) {
      resetForm();
    }
  }
);
</script>

<style scoped>
/* Dialog customization */
:deep(.p-dialog) {
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

:deep(.p-dialog-header) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border-radius: 1rem 1rem 0 0;
  padding: 1.5rem;
  border-bottom: none;
}

:deep(.p-dialog-title) {
  font-weight: 700;
  font-size: 1.25rem;
}

:deep(.p-dialog-content) {
  padding: 2rem;
  background-color: white;
  border-radius: 0;
}

:deep(.p-dialog-footer) {
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-radius: 0 0 1rem 1rem;
  padding: 1.5rem;
}

/* Dark theme support */
:global(.dark-theme) :deep(.p-dialog-content) {
  background-color: #1f2937;
  color: #f9fafb;
}

:global(.dark-theme) :deep(.p-dialog-footer) {
  background-color: #111827;
  border-top-color: #374151;
}

/* Password field styling */
:deep(.password-field .p-password) {
  width: 100%;
}

:deep(.password-field .p-password input) {
  width: 100%;
  height: 3rem;
  padding: 0 1rem;
  font-size: 1rem;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  background-color: white;
}

:deep(.password-field .p-password input:focus) {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  outline: none;
}

:deep(.password-error .p-password input) {
  border-color: #ef4444;
}

:deep(.password-error .p-password input:focus) {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Dark theme password field */
:global(.dark-theme) :deep(.password-field .p-password input) {
  background-color: #374151;
  border-color: #4b5563;
  color: white;
}

:global(.dark-theme) :deep(.password-field .p-password input:focus) {
  border-color: #6366f1;
  background-color: #374151;
}

/* Button styling */
:deep(.p-button) {
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  padding: 0.75rem 1.5rem;
}

:deep(.p-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.p-button:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Password strength indicator */
:deep(.p-password-meter) {
  margin-top: 0.5rem;
}

:deep(.p-password-info) {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

:global(.dark-theme) :deep(.p-password-info) {
  color: #9ca3af;
}
</style>
