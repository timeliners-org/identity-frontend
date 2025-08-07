<template>
  <div class="info-card">
    <label class="info-label">{{ label }}</label>
    <div class="info-content">
      <div v-if="!isEditing" class="flex items-center justify-between">
        <p :class="{ 'font-mono': monospace }">{{ modelValue }}</p>
        <Button
          icon="pi pi-pencil"
          size="small"
          text
          class="edit-button"
          @click="startEditing"
        />
      </div>
      <div v-else class="flex items-center gap-2">
        <InputText
          v-model="localValue"
          :placeholder="placeholder"
          :disabled="disabled"
          class="flex-1"
          @keyup.enter="saveEdit"
          @keyup.escape="cancelEdit"
        />
        <Button
          icon="pi pi-check"
          size="small"
          severity="success"
          :loading="saving"
          @click="saveEdit"
        />
        <Button
          icon="pi pi-times"
          size="small"
          severity="secondary"
          text
          @click="cancelEdit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  monospace: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "save"]);

const isEditing = ref(false);
const localValue = ref(props.modelValue);
const saving = ref(false);

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  }
);

const startEditing = () => {
  if (props.disabled) return;
  localValue.value = props.modelValue;
  isEditing.value = true;
};

const cancelEdit = () => {
  localValue.value = props.modelValue;
  isEditing.value = false;
};

const saveEdit = async () => {
  if (localValue.value === props.modelValue) {
    isEditing.value = false;
    return;
  }

  saving.value = true;
  try {
    await emit("save", localValue.value);
    emit("update:modelValue", localValue.value);
    isEditing.value = false;
  } catch (error) {
    console.error("Failed to save:", error);
    // Keep editing mode open on error
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.info-card {
  background-color: rgb(249 250 251);
  border: 1px solid rgb(229 231 235);
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s ease-in-out;
  position: relative;
  cursor: pointer;
}

/* Subtle hover effect to indicate editability */
.info-card:hover {
  border-color: rgb(99 102 241);
  background-color: rgb(243 244 246);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

:global(.dark) .info-card {
  background-color: rgba(55, 65, 81, 0.7);
  border-color: rgb(75 85 99);
}

:global(.dark) .info-card:hover {
  border-color: rgb(99 102 241);
  background-color: rgba(75, 85, 99, 0.8);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}

.info-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(55 65 81);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

:global(.dark) .info-label {
  color: rgb(209 213 219);
}

.info-content {
  color: rgb(17 24 39);
  position: relative;
}

:global(.dark) .info-content {
  color: rgb(243 244 246);
}

.edit-button {
  opacity: 0.4;
  transition: all 0.2s ease-in-out;
  background: transparent !important;
  border: none !important;
  color: rgb(99 102 241) !important;
}

.edit-button:hover {
  background: transparent !important;
  border: none !important;
  color: rgb(79 70 229) !important;
  transform: scale(1.1);
}

.info-card:hover .edit-button {
  opacity: 1;
}

/* Dark mode styling for edit button */
:global(.dark) .edit-button {
  background: transparent !important;
  border: none !important;
  color: rgb(129 140 248) !important;
}

:global(.dark) .edit-button:hover {
  background: transparent !important;
  border: none !important;
  color: rgb(165 180 252) !important;
  text-shadow: 0 0 8px rgba(129, 140, 248, 0.6);
}

/* InputText styling */
:deep(.p-inputtext) {
  border-color: rgb(209 213 219);
  background-color: white;
  color: rgb(17 24 39);
  border-width: 2px;
  transition: all 0.2s ease-in-out;
}

:global(.dark) :deep(.p-inputtext) {
  border-color: rgb(75 85 99);
  background-color: rgb(31 41 55);
  color: rgb(243 244 246);
  border-width: 2px;
}

:deep(.p-inputtext:focus) {
  border-color: rgb(99 102 241);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

:global(.dark) :deep(.p-inputtext:focus) {
  border-color: rgb(129 140 248);
  box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.3);
}

/* Action buttons styling */
:deep(.p-button.p-button-success) {
  background-color: rgb(34 197 94);
  border-color: rgb(34 197 94);
}

:deep(.p-button.p-button-success:hover) {
  background-color: rgb(22 163 74);
  border-color: rgb(22 163 74);
  transform: scale(1.05);
}

:deep(.p-button.p-button-secondary) {
  background-color: rgb(107 114 128);
  border-color: rgb(107 114 128);
  color: white;
}

:deep(.p-button.p-button-secondary:hover) {
  background-color: rgb(75 85 99);
  border-color: rgb(75 85 99);
  transform: scale(1.05);
}

/* Add a subtle animation to indicate interactivity */
@keyframes pulse-edit {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.info-card:hover .edit-button {
  animation: pulse-edit 2s infinite;
}
</style>
