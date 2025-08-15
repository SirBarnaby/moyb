<script setup lang="ts">
import { watch } from 'vue';
import { useMuscleStore } from "@/stores/muscle.store";
import AnatomyViewer from "@/features/anatomy-viewer/AnatomyViewerMobile.vue";
import { useExerciseSelectorStore } from "@/stores/exerciseSelector.store";

const muscleStore = useMuscleStore();
const exerciseSelectorStore = useExerciseSelectorStore();

// Watch the muscle store and update the exercise selector store accordingly
watch(() => muscleStore.muscle, (newMuscle) => {
  if (newMuscle) {
    exerciseSelectorStore.openSelector();
  } else {
    exerciseSelectorStore.closeSelector();
  }
});
</script>

<template>
  <section class="bodysection section">
    <div class="maincontainer container">
      <AnatomyViewer />
    </div>
  </section>
</template>

<style scoped>
.bodysection {
  position: static;
  display: flex;
  height: 85vh;
  min-height: 85vh;
  justify-content: center;
  align-items: center;
}

.maincontainer {
  display: flex;
  flex-direction: column; /* Ensures elements stack vertically */
  justify-content: center; /* Centers vertically */
  align-items: center; /* Centers horizontally */
  height: 100%;
  width: 100%;
}
</style>
