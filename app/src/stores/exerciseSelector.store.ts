import { defineStore } from "pinia";
import { ref, computed } from "vue";

/**
 * AI-Primer: This Pinia store manages the state for the exercise selector.
 * It tracks whether the exercise selector is open or closed.
 */
export const useExerciseSelectorStore = defineStore("exerciseSelector", () => {
  // State
  const isOpen = ref(false);

  // Getters
  const isExerciseSelectorOpen = computed(() => isOpen.value);

  // Actions
  function openSelector() {
    isOpen.value = true;
  }

  function closeSelector() {
    isOpen.value = false;
  }

  function toggleSelector() {
    isOpen.value = !isOpen.value;
  }

  return {
    // State
    isOpen,
    
    // Getters
    isExerciseSelectorOpen,
    
    // Actions
    openSelector,
    closeSelector,
    toggleSelector
  };
});