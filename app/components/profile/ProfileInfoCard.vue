<template>
  <div class="info-card">
    <label class="info-label">{{ label }}</label>
    <div v-if="type === 'text'" class="info-content">
      <p :class="{ 'font-mono': monospace }">{{ value }}</p>
    </div>
    <div v-else-if="type === 'status'" class="info-content">
      <div class="flex items-center gap-2">
        <div v-if="isVerified" class="status-badge status-verified">
          <i class="pi pi-check-circle" />
          Verified Account
        </div>
        <div v-else class="status-badge status-unverified">
          <i class="pi pi-exclamation-triangle" />
          Unverified Account
        </div>
      </div>
    </div>
    <div v-else-if="type === 'groups'" class="info-content">
      <div v-if="groups && groups.length > 0" class="flex flex-wrap gap-2">
        <span v-for="group in groups" :key="group" class="group-badge">
          {{ group }}
        </span>
      </div>
      <p v-else class="no-groups">No groups assigned</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ["text", "status", "groups"].includes(value),
  },
  value: {
    type: String,
    default: "",
  },
  monospace: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  groups: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.info-card {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s ease-in-out;
}

:global(.dark-theme) .info-card {
  background-color: rgba(55, 65, 81, 0.5) !important;
}

.info-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

:global(.dark-theme) .info-label {
  color: #d1d5db !important;
}

.info-content p {
  color: #111827;
  margin: 0;
}

.info-content p.font-mono {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas,
    "Liberation Mono", Menlo, monospace;
  font-size: 0.875rem;
}

:global(.dark-theme) .info-content p {
  color: #f9fafb !important;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-verified {
  background-color: #dcfce7;
  color: #166534;
}

:global(.dark-theme) .status-verified {
  background-color: rgba(22, 101, 52, 0.3) !important;
  color: #86efac !important;
}

.status-unverified {
  background-color: #fed7aa;
  color: #9a3412;
}

:global(.dark-theme) .status-unverified {
  background-color: rgba(154, 52, 18, 0.3) !important;
  color: #fdba74 !important;
}

.group-badge {
  background-color: #ddd6fe;
  color: #5b21b6;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

:global(.dark-theme) .group-badge {
  background-color: rgba(91, 33, 182, 0.3) !important;
  color: #c4b5fd !important;
}

.no-groups {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

:global(.dark-theme) .no-groups {
  color: #9ca3af !important;
}
</style>
