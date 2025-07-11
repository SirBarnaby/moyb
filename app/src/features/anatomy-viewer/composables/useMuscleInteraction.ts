/**
 * @fileoverview AI-Primer: A Vue composable that manages the state and logic for
 * interacting with the human anatomy SVG. It handles muscle selection, volume visualization,
 * and communicates with the data stores, but performs no direct DOM manipulation.
 */

import { ref, watch, computed, onMounted, onUnmounted, type Ref } from 'vue';
import { useAllExercisesStore } from '@/stores/exercise.store';
import { useWorkoutPlanStore } from '@/stores/workoutPlan.store';
import { useMuscleStore } from '@/stores/muscle.store';
import { getMuscleColorByVolume } from '@/common/CSSHelper.ts';
import { getMuscleElementId } from '../services/muscle-map.ts';
import { MUSCLE_SELECTION_FADE_OUT_MS } from '../constants.ts';

/**
 * Manages reactive interactions for the anatomy viewer.
 * @param {Ref<HTMLElement | undefined>} anatomyRoot - A template ref to the root element for click-outside detection.
 */
export function useMuscleInteraction(anatomyRoot: Ref<HTMLElement | undefined>) {
  const bllStore = useWorkoutPlanStore();
  const allExercisesStore = useAllExercisesStore();
  const muscleStore = useMuscleStore();

  const selectedMuscleName = ref<string | null>(null);
  const muscleVolumes = ref<Record<string, number>>({});
  const isTemporarilySelected = ref(false);

  // Watch for changes in muscle volume from the store and update local state.
  watch(
    () => bllStore.presetMuscleArray,
    (newArray) => {
      const newVolumes: Record<string, number> = {};
      for (const muscle of newArray) {
        const elementId = getMuscleElementId(muscle.nameOfMuscle);
        if (elementId) {
          newVolumes[elementId] = muscle.getTotalSetVolume();
        }
      }
      muscleVolumes.value = newVolumes;
    },
    { deep: true, immediate: true }
  );

  /**
   * Computed property to generate class objects for each muscle group.
   * This replaces direct DOM manipulation with reactive class bindings. [cite: 18]
   */
  const muscleStyles = computed(() => {
    const styles: Record<string, { fill: string }> = {};
    const maxSets = bllStore.setsPerWeekMax;

    for (const elementId in muscleVolumes.value) {
      const volume = muscleVolumes.value[elementId];
      styles[elementId] = {
        fill: getMuscleColorByVolume(volume, maxSets),
      };
    }
    return styles;
  });

  /**
   * Computed property to generate class objects for each muscle group.
   * This replaces direct DOM manipulation with reactive class bindings. [cite: 18]
   */
  const muscleClasses = computed(() => {
    const classes: Record<string, object> = {};
    const selectedId = selectedMuscleName.value ? getMuscleElementId(selectedMuscleName.value) : null;

    for (const elementId in muscleVolumes.value) {
      classes[elementId] = {
        selected: selectedId === elementId && isTemporarilySelected.value,
      };
    }
    return classes;
  });

  /**
   * Handles the logic when a muscle is clicked in the view.
   * It updates stores and manages the temporary selection highlight.
   * @param {string} muscleName - The name of the clicked muscle.
   */
  const handleMuscleClick = (muscleName: string) => {
    console.log(`[useMuscleInteraction] Muscle clicked: ${muscleName}`);

    // Update stores
    allExercisesStore.loadAllExercisesByTargetMuscle(muscleName);
    muscleStore.loadMuscleByName(muscleName);

    // Set reactive state for selection
    selectedMuscleName.value = muscleName;
    isTemporarilySelected.value = true;

    // Visually deselect after a delay
    setTimeout(() => {
      isTemporarilySelected.value = false;
    }, MUSCLE_SELECTION_FADE_OUT_MS);
  };

  /**
   * Handles clicks outside the SVG component to deselect the muscle.
   * @param {MouseEvent} event - The click event.
   */
  const handleClickOutside = (event: MouseEvent) => {
    if (anatomyRoot.value && !anatomyRoot.value.contains(event.target as Node)) {
      if (selectedMuscleName.value) {
        console.log('[useMuscleInteraction] Clicked outside, deselecting.');
        selectedMuscleName.value = null;
        isTemporarilySelected.value = false;
      }
    }
  };

  /**
   * Ensure SVG fills stay in sync whenever either volumes or the max-set cap changes.
   */
  watch(
    [muscleVolumes, () => bllStore.setsPerWeekMax],
    () => {
      const maxSets = bllStore.setsPerWeekMax;
      for (const elementId in muscleVolumes.value) {
        const volume = muscleVolumes.value[elementId];
        const group = document.getElementById(elementId);
        if (!group || !(group instanceof SVGElement)) continue;
        const paths = group.getElementsByTagName('path');
        const fill = getMuscleColorByVolume(volume, maxSets);
        for (let i = 0; i < paths.length; i++) {
          (paths[i] as SVGPathElement).style.fill = fill;
        }
      }
    },
    { deep: true, immediate: true }
  );

  onMounted(() => document.addEventListener('click', handleClickOutside));
  onUnmounted(() => document.removeEventListener('click', handleClickOutside));

  return {
    muscleClasses,
    muscleStyles,
    handleMuscleClick,
  };
}