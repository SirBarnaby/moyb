<!-- AI-PRIMER: ExerciseSelector.vue
  Purpose: Presents UI controls for choosing an Exercise either by currently selected muscle **or** via free-text search.
  Invariants: Relies exclusively on Pinia `useAllExercisesStore` for state. No direct DOM queries or global mutations. -->
<script setup lang="ts">
import { ref } from 'vue';
import ExerciseSelectorPopup from "@/components/mobile/ExerciseSelectorPopup.vue";
import ExerciseSelectorMain from "@/components/mobile/ExerciseSelectorMain.vue";
import { useAllExercisesStore } from "@/stores/exercise.store";

const exerciseStore = useAllExercisesStore();

const props = defineProps<{
  isVisible: boolean;
  isSearchMode: boolean;
}>();

const isPopupVisible = ref(false);

const togglePopup = (forceState?: boolean) => {
  if (forceState !== undefined) {
    isPopupVisible.value = forceState;
  } else {
    isPopupVisible.value = !isPopupVisible.value;
  }

  // If we're closing the popup in search mode, clear the results.
  if (!isPopupVisible.value && props.isSearchMode) {
    exerciseStore.clearSearchResults();
  }
};

// Close popup and clear search when an exercise is selected
const onExerciseSelected = () => {
  isPopupVisible.value = false;
  if (props.isSearchMode) {
    exerciseStore.clearSearchResults();
  }
};
</script>

<template>
  <div v-show="props.isVisible">
    <ExerciseSelectorMain
      @toggle-popup="togglePopup"
      @exercise-selected="onExerciseSelected"
      :is-search-mode="props.isSearchMode"
    />
    <ExerciseSelectorPopup
      :is-visible="isPopupVisible"
      @exercise-selected="onExerciseSelected"
      @close-popup="togglePopup(false)"
    />
  </div>
</template>

<style scoped>

</style>
