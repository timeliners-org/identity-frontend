<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <!-- Username field (only for register) -->
    <div v-if="mode === 'register'" class="space-y-2">
      <label
        for="username"
        class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >Username</label
      >
      <div class="relative">
        <InputText
          id="username"
          v-model="username"
          placeholder="Choose a username"
          class="w-full h-12 pl-4 pr-4 text-base border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
          :class="{
            'border-red-500 focus:border-red-500 focus:ring-red-200': formError,
          }"
        />
      </div>
    </div>

    <!-- Email field (always for register, optional for login as identifier) -->
    <div v-if="mode === 'register'" class="space-y-2">
      <label
        for="email"
        class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >Email Address</label
      >
      <div class="relative">
        <InputText
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your email address"
          class="w-full h-12 pl-4 pr-4 text-base border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
          :class="{
            'border-red-500 focus:border-red-500 focus:ring-red-200': formError,
          }"
        />
      </div>
    </div>

    <!-- Identifier field (only for login) -->
    <div v-if="mode === 'login'" class="space-y-2">
      <label
        for="identifier"
        class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >Email or Username</label
      >
      <div class="relative">
        <InputText
          id="identifier"
          v-model="identifier"
          placeholder="Enter your email or username"
          class="w-full h-12 pl-4 pr-4 text-base border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
          :class="{
            'border-red-500 focus:border-red-500 focus:ring-red-200': formError,
          }"
        />
      </div>
    </div>

    <!-- Password field -->
    <div class="space-y-2">
      <label
        for="password"
        class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >Password</label
      >
      <div class="relative">
        <ClientOnly>
          <Password
            id="password"
            v-model="password"
            :placeholder="
              mode === 'register'
                ? 'Create a strong password'
                : 'Enter your password'
            "
            toggle-mask
            :feedback="mode === 'register'"
            :prompt-label="
              mode === 'register' ? 'Choose a password' : undefined
            "
            :weak-label="mode === 'register' ? 'Weak password' : undefined"
            :medium-label="mode === 'register' ? 'Medium password' : undefined"
            :strong-label="mode === 'register' ? 'Strong password' : undefined"
            class="w-full password-field"
            :class="{ 'password-error': formError }"
          />
          <template #fallback>
            <InputText
              id="password"
              v-model="password"
              type="password"
              :placeholder="
                mode === 'register'
                  ? 'Create a strong password'
                  : 'Enter your password'
              "
              class="w-full h-12 pl-4 pr-4 text-base border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              :class="{
                'border-red-500 focus:border-red-500 focus:ring-red-200':
                  formError,
              }"
            />
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- Error message -->
    <div
      v-if="formError"
      class="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-3"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-exclamation-triangle text-red-500 dark:text-red-400" />
        <span class="text-red-700 dark:text-red-300 text-sm font-medium">{{
          formError
        }}</span>
      </div>
    </div>

    <!-- Success message (for register) -->
    <div
      v-if="successMessage"
      class="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg p-3"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-check-circle text-green-500 dark:text-green-400" />
        <span class="text-green-700 dark:text-green-300 text-sm font-medium">{{
          successMessage
        }}</span>
      </div>
    </div>

    <!-- Submit button -->
    <Button
      type="submit"
      :loading="isLoading"
      class="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
    >
      <span class="text-base">{{
        mode === "login" ? "Sign In" : "Create Account"
      }}</span>
    </Button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../../composables/useAuth";
import { useRouter } from "vue-router";
import registerUser from "../../api/register";

// Props
const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
});

// Form fields
const identifier = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const formError = ref("");
const successMessage = ref("");
const isLoading = ref(false);

const auth = useAuth();
const router = useRouter();

const validateForm = () => {
  if (props.mode === "login") {
    if (!identifier.value || !password.value) {
      formError.value = "Please fill in all fields";
      return false;
    }
  } else {
    if (!username.value || !email.value || !password.value) {
      formError.value = "Please fill in all fields";
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      formError.value = "Please enter a valid email address";
      return false;
    }

    // Password strength validation
    if (password.value.length < 8) {
      formError.value = "Password must be at least 8 characters long";
      return false;
    }
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    formError.value = "";
    successMessage.value = "";

    if (props.mode === "login") {
      await auth.login(identifier.value, password.value);
      await router.push("/profile");
    } else {
      // Register user
      const response = await registerUser(
        email.value,
        username.value,
        password.value
      );

      // Registration was successful if we get a response with id
      if (response.id) {
        successMessage.value =
          response.message ||
          "Account created successfully! You can now log in.";
        // Clear form
        username.value = "";
        email.value = "";
        password.value = "";

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        formError.value =
          response.message || "Registration failed. Please try again.";
      }
    }
  } catch (error) {
    console.error(`${props.mode} failed:`, error);

    if (props.mode === "login") {
      formError.value =
        "Invalid credentials. Please check your email/username and password.";
    } else {
      // Handle specific registration errors
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "";
      if (typeof errorMessage === "string" && errorMessage.includes("email")) {
        formError.value = "This email address is already registered.";
      } else if (
        typeof errorMessage === "string" &&
        errorMessage.includes("username")
      ) {
        formError.value = "This username is already taken.";
      } else {
        formError.value = "Registration failed. Please try again.";
      }
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Custom styling that works with PrimeVue themes */
:deep(.p-inputtext) {
  height: 3rem;
  font-size: 1rem;
}

:deep(.password-field) {
  width: 100%;
}

:deep(.password-field .p-password-input) {
  width: 100%;
  height: 3rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0 1rem;
  transition: all 0.2s ease-in-out;
  background-color: white;
  color: #374151;
}

:deep(.password-field .p-password-input:focus) {
  border-color: #6366f1;
  box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25);
}

/* Password strength meter styling */
:deep(.p-password-meter) {
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
}

:deep(.p-password-info) {
  margin-top: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Dark mode overrides */
:global(.dark-theme) :deep(.password-field .p-password-input) {
  background-color: #374151 !important;
  border-color: #4b5563 !important;
  color: white !important;
}

:global(.dark-theme) :deep(.password-field .p-password-input:focus) {
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25) !important;
}

:global(.dark-theme) :deep(.p-password) {
  background-color: #374151 !important;
}

:global(.dark-theme) :deep(.p-password .p-inputtext) {
  background-color: #374151 !important;
  border-color: #4b5563 !important;
  color: white !important;
}

:global(.dark-theme) :deep(.p-password .p-inputtext:focus) {
  background-color: #374151 !important;
  border-color: #6366f1 !important;
  color: white !important;
}

:global(.dark-theme) :deep(.p-password-meter) {
  background-color: #4b5563 !important;
}

:global(.dark-theme) :deep(.p-password-info) {
  color: #9ca3af !important;
}

:deep(.p-button) {
  height: 3rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  border: none;
}

:deep(.p-button:disabled) {
  opacity: 0.7;
  transform: none;
}

:deep(.p-button-loading .p-button-loading-icon) {
  font-size: 1rem;
}

/* Error state styling */
.border-red-500 {
  border-color: #ef4444 !important;
}

.border-red-500:focus {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.25) !important;
}

.password-error :deep(.p-password-input) {
  border-color: #ef4444 !important;
}

.password-error :deep(.p-password-input:focus) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.25) !important;
}
</style>
