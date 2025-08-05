<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useMuscleStore } from "@/stores/muscle.store.ts";

// Props
const props = defineProps<{
  isVisible: boolean
}>();

// Emits
const emit = defineEmits(['close']);

// Store
const muscleStore = useMuscleStore();
const targetMuscle = computed(() => muscleStore.muscle);

// Watch visibility to reset state
watch(() => props.isVisible, (newVal: boolean) => {
  if (!newVal) {
    // Reset any state here if needed
  }
});

// Handle close
const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div
    v-if="isVisible"
    class="muscle-header-popup"
    :class="{ 'visible': isVisible }"
  >
    <div class="popup-backdrop" @click="handleClose"></div>
    <div class="popup-content">
      <div class="header-content">
        <button
          class="toggle-button"
          @click="handleClose"
          title="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
        <div class="header-flex">
          <div class="text-section">
            <p class="description-text">{{ targetMuscle?.description }}</p>
          </div>
        </div>
      </div>

      <div class="title-section">
        <h1 class="main-title">{{ targetMuscle?.name?.toUpperCase() }}</h1>
        <p class="subtitle">{{ targetMuscle?.nameLatin }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.muscle-header-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: none;
  pointer-events: none;
}

.muscle-header-popup.visible {
  display: block;
  pointer-events: auto;
}

.popup-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.toggle-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.toggle-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.header-flex {
  flex: 1;
  margin-left: 16px;
}

.text-section {
  flex: 1;
}

.description-text {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.title-section {
  text-align: center;
  margin-top: 16px;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0;
}
</style>
