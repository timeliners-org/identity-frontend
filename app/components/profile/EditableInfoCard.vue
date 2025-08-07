<template>
  <BaseInfoCard :label="label">
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
  </BaseInfoCard>
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
.edit-button {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

:deep(.info-card):hover .edit-button {
  opacity: 1;
}

/* InputText styling */
:deep(.p-inputtext) {
  border-color: rgb(209 213 219);
  background-color: white;
  color: rgb(17 24 39);
}

:global(.dark) :deep(.p-inputtext) {
  border-color: rgb(75 85 99);
  background-color: rgb(31 41 55);
  color: rgb(243 244 246);
}

:deep(.p-inputtext:focus) {
  border-color: rgb(99 102 241);
  box-shadow: 0 0 0 1px rgb(99 102 241);
}
</style>
