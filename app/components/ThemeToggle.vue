<template>
  <div class="theme-toggle-container">
    <!-- Simple toggle button -->
    <Button
      v-if="!showOptions"
      :icon="getThemeIcon()"
      :aria-label="getThemeLabel()"
      class="theme-toggle-btn"
      text
      rounded
      @click="handleToggleClick"
    />

    <!-- Dropdown with all options -->
    <div v-else class="theme-dropdown">
      <Button
        :icon="getThemeIcon()"
        :aria-label="'Theme options'"
        class="theme-toggle-btn"
        text
        rounded
        @click="toggleDropdown"
      />

      <div v-if="dropdownOpen" class="theme-options">
        <button
          v-for="option in themeOptions"
          :key="option.value"
          :class="['theme-option', { active: theme === option.value }]"
          @click="selectTheme(option.value)"
        >
          <i :class="option.icon" />
          <span>{{ option.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useTheme } from "../composables/useTheme";

const props = defineProps({
  showOptions: {
    type: Boolean,
    default: false,
  },
});

const { isDark, theme, toggleTheme, setTheme } = useTheme();

// Track if component has hydrated to prevent mismatch
const isHydrated = ref(false);

const dropdownOpen = ref(false);

const themeOptions = [
  { value: "light", label: "Light", icon: "pi pi-sun" },
  { value: "dark", label: "Dark", icon: "pi pi-moon" },
  { value: "system", label: "System", icon: "pi pi-desktop" },
];

const getThemeIcon = () => {
  // During SSR or before hydration, always show system icon to prevent hydration mismatch
  if (!import.meta.client || !isHydrated.value) {
    return "pi pi-desktop";
  }

  if (theme.value === "system") {
    return "pi pi-desktop";
  }
  return isDark.value ? "pi pi-sun" : "pi pi-moon";
};

const getThemeLabel = () => {
  // During SSR or before hydration, use generic label
  if (!import.meta.client || !isHydrated.value) {
    return "Theme options";
  }

  if (theme.value === "system") {
    return "Theme: System";
  }
  return isDark.value ? "Switch to light mode" : "Switch to dark mode";
};

const handleToggleClick = () => {
  if (props.showOptions) {
    toggleDropdown();
  } else {
    toggleTheme();
  }
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectTheme = (selectedTheme) => {
  setTheme(selectedTheme);
  dropdownOpen.value = false;
};

// Close dropdown when clicking outside
onMounted(() => {
  // Set hydrated flag to enable proper theme icon display
  isHydrated.value = true;

  const handleClickOutside = (event) => {
    const target = event.target;
    if (dropdownOpen.value && !target?.closest(".theme-dropdown")) {
      dropdownOpen.value = false;
    }
  };
  document.addEventListener("click", handleClickOutside);
  onUnmounted(() => document.removeEventListener("click", handleClickOutside));
});
</script>

<style scoped>
.theme-toggle-container {
  position: relative;
}

.theme-toggle-btn {
  transition: all var(--transition-theme);
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
}

.theme-dropdown {
  position: relative;
}

.theme-options {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgb(var(--color-background));
  border: 1px solid rgb(var(--color-border));
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 120px;
  z-index: 50;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-align: left;
  background: none;
  border: none;
  color: rgb(var(--color-foreground));
  cursor: pointer;
  transition: background-color var(--transition-theme);
}

.theme-option:hover {
  background-color: rgb(var(--color-background-secondary));
}

.theme-option.active {
  background-color: rgb(var(--color-primary) / 0.1);
  color: rgb(var(--color-primary));
}

.theme-option:first-child {
  border-radius: 0.5rem 0.5rem 0 0;
}

.theme-option:last-child {
  border-radius: 0 0 0.5rem 0.5rem;
}
</style>
