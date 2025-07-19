import { defineStore } from "pinia";
import { ref } from "vue";
import { Exercise } from "@/core/exercise/Exercise.entity";
import { exerciseRepository } from "@/main";

/**
 * AI-Primer: This Pinia store manages the state for exercises.
 * It handles loading exercises by target muscle and managing search results.
 * It is the single source of truth for the exercise list in the UI.
 */
export const useAllExercisesStore = defineStore("exercise", () => {
  const exercises = ref<Exercise[]>([]);
  const isSearchActive = ref(false);

  async function loadAllExercisesByTargetMuscle(targetMuscle: string) {
    isSearchActive.value = false;
    try {
      const dbExercises = await exerciseRepository.findByTargetMuscle(
        targetMuscle
      );
      // The repository returns plain objects; we map them to domain entities.
      exercises.value = dbExercises.map(Exercise.create);
    } catch (error) {
      console.error(
        `Failed to load exercises for muscle "${targetMuscle}":`,
        error
      );
      exercises.value = [];
    }
  }

  /**
   * Sets the exercises list from search results.
   * Ensures that the raw data is converted to Exercise entities.
   */
  function setSearchResults(results: Omit<Exercise, 'isCalisthenics' | 'isSpecial' | 'getAffectedMuscles'>[]) {
    isSearchActive.value = true;
    exercises.value = results.map(Exercise.create);
  }

  function clearSearchResults() {
    exercises.value = [];
    isSearchActive.value = false;
  }

  return {
    exercises,
    isSearchActive,
    loadAllExercisesByTargetMuscle,
    setSearchResults,
    clearSearchResults,
  };
});
