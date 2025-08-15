<script setup lang="ts">
import WorkoutLogTest from "@/components-mobile/WorkoutLogTest.vue";
import { useWorkoutPlanStore } from "@/stores/workoutPlan.store.ts";
import { computed, ref, watch } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const bllStore = useWorkoutPlanStore();

// Track visibility state for workout log
const isLogVisible = ref(false);

// Computed property for exercises
const exercises = computed(() => {
  if (!bllStore.exercisesArray || !bllStore.exercisesArraySets) return [];
  return bllStore.exercisesArray.map((exercise, index) => ({
    exercise,
    sets: bllStore.exercisesArraySets[index]
  }));
});

// Watch for changes in exercises array to automatically show/hide the log
watch(exercises, (newExercises, oldExercises) => {
  // If we're adding our first exercise (list was empty, now has items)
  if (oldExercises && oldExercises.length === 0 && newExercises.length > 0) {
    isLogVisible.value = true;
  }
  // If we're removing our last exercise (list had items, now empty)
  else if (oldExercises && oldExercises.length > 0 && newExercises.length === 0) {
    isLogVisible.value = false;
  }
}, { deep: true });

// Toggle handler for the workout log side button
const toggleLog = () => {
  if (exercises.value.length === 0) return; // no-op when no exercises
  // If log is already visible, just hide it
  if (isLogVisible.value) {
    isLogVisible.value = false;
  } else {
    isLogVisible.value = true;
  }
};

// Expose the visibility states and toggle functions
defineExpose({
  isLogVisible,
  toggleLog,
});
</script>

<template>
  <div class="panels-wrapper">
    <!-- Workout Log -->
    <WorkoutLogTest :is-log-visible="isLogVisible" />

    <!-- Button to toggle workout log -->
    <button
        class="log-toggle-button"
        :class="{
          'toggle-visible': exercises.length > 0,
          'toggle-hidden': exercises.length === 0,
          'present': isLogVisible,
          'away': !isLogVisible
        }"
        :disabled="exercises.length === 0"
        @click="toggleLog"
        aria-label="Toggle workout log"
        title="Toggle workout log"
    >
      <ChevronLeft v-if="isLogVisible" :size="24" />
      <ChevronRight v-else :size="24" />
    </button>
  </div>
</template>

<style scoped>
/* Side toggle button */
.log-toggle-button {
  position: fixed;
  top: calc(8vh + 8px);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms cubic-bezier(0, 0, 0.2, 1), left 600ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 6px 6px 12px rgba(0,0,0,0.25);
  opacity: 0; /* default hidden until exercises exist */
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
}

/* Is the menu hidden to the left of screen? If yes, show button at screen edge. */
.log-toggle-button.present {
  left: calc(85vw + 8px);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.log-toggle-button.away {
  left: 5vw;
}

.metrics-toggle-button {
  top: calc(8vh + 55px);
}

.log-toggle-button:hover {
  transform: scale(1.08);
}

/* Do we have exercises? If no, then HIDE BUTTON COMPLETELY. */
.log-toggle-button.toggle-visible {
  opacity: 1;
  pointer-events: auto;
}

.log-toggle-button.toggle-hidden {
  opacity: 0;
  pointer-events: none;
}


</style>
