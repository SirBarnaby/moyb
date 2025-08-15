<script setup lang="ts">
/**
 * @fileoverview AI-Primer: The main component for the Anatomy Viewer feature.
 * It orchestrates the state logic from the `useMuscleInteraction` composable
 * with the pure `AnatomySvg` presentation component. It is responsible for
 * connecting the feature to the global state stores.
 */

import { ref } from 'vue';
import { useMuscleInteraction } from './composables/useMuscleInteraction.ts';
import AnatomySvg from '@/ui/AnatomySvgMobile.vue';
import { useExerciseSelectorStore } from '@/stores/exerciseSelector.store';

// A template ref to the root element of the feature, passed to the composable
// for detecting outside clicks.
const anatomyRoot = ref<HTMLElement | undefined>();

const exerciseSelectorStore = useExerciseSelectorStore();

const { muscleClasses, muscleStyles, handleMuscleClick } = useMuscleInteraction(anatomyRoot);
</script>

<template>
  <div ref="anatomyRoot" class="anatomy-container">
    <AnatomySvg
      :muscle-classes="muscleClasses"
      :muscle-styles="muscleStyles"
      @muscle-click="handleMuscleClick"
    />
  </div>
</template>

<style scoped>
.anatomy-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>