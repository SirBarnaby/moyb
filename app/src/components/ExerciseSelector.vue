<script setup lang="ts">
import { ref, computed } from 'vue';
import ExerciseSelectorPopup from "@/components/ExerciseSelectorPopup.vue";
import ExerciseSelectorMain from "@/components/ExerciseSelectorMain.vue";
import { useAllExercisesStore } from "@/dal/Exercise.ts";

const exerciseStore = useAllExercisesStore();

// Add props to determine visibility based on muscle selection
const props = defineProps<{
  isMuscleSelected: boolean
}>();

const isPopupVisible = ref(false);

// Computed property to determine if we're showing search results
const isShowingSearchResults = computed(() => {
  // Check if we have exercises from a search (not from muscle selection)
  return exerciseStore.exercises.length > 0 && 
         (!props.isMuscleSelected || exerciseStore.isSearchActive);
});

const togglePopup = (forceState?: boolean) => {
  if (forceState !== undefined) {
    isPopupVisible.value = forceState;
  } else {
    isPopupVisible.value = !isPopupVisible.value;
  }
};

// Close popup when exercise is selected
const onExerciseSelected = () => {
  isPopupVisible.value = false;
};
</script>

<template>
  <div class="exerciseselector" v-if="isMuscleSelected || isShowingSearchResults">
    <ExerciseSelectorMain 
      @toggle-popup="togglePopup" 
      @exercise-selected="onExerciseSelected"
      :is-search-mode="isShowingSearchResults"
    />
    <ExerciseSelectorPopup 
      :is-visible="isPopupVisible" 
      @exercise-selected="onExerciseSelected" 
    />
  </div>
</template>

<style scoped>
.exerciseselector {
  position: absolute;
  left: 47px;
  top: 107px;
  overflow: visible;
  width: 30%;
  height: 70%;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  backdrop-filter: blur(4px);
  overflow-wrap: normal;
  object-fit: fill;
  display: flex;
  flex-direction: column;
}
</style>
