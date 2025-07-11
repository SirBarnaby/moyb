import { defineStore } from "pinia";
import { ref } from "vue";
import type { Exercise } from "@/core/exercise/Exercise.entity";
import { MuscleHelper } from "@/bll/MuscleHelper.ts";
import type { MuscleInExercise } from "@/core/muscle/MuscleInExercise.entity";

/**
 * AI-Primer: Central store for the workout-planner feature.
 * Holds the planned exercises, set counts, and live muscle-volume calculations.
 * Pure state + synchronous mutations; no business logic or side-effects here.
 */
export const useWorkoutPlanStore = defineStore("workoutPlan", () => {
  /* ---------------- state ---------------- */
  const exercises = ref<Exercise[]>([]);
  const exerciseSets = ref<number[]>([]);
  const presetMuscles = ref<MuscleHelper[]>(MuscleHelper.initializeMuscleList());

  /** configuration values – editable through the Options menu */
  const setsPerWeekMax = ref(20);
  const synergisticMultiplier = ref(0.5);
  const stabilizingMultiplier = ref(0.33);

  /* ---------------- private helpers ---------------- */
  function indexOfExercise(e: Exercise) {
    return exercises.value.findIndex((ex) => ex.id === e.id);
  }

  /* ---------------- actions ---------------- */
  function addExercise(exercise: Exercise, sets: number) {
    if (sets <= 0) return;
    const idx = indexOfExercise(exercise);
    if (idx >= 0) {
      exerciseSets.value[idx] += sets;
    } else {
      exercises.value.push(exercise);
      exerciseSets.value.push(sets);
    }
    recalcMuscleVolumes(exercise, sets);
  }

  function removeExercise(exercise: Exercise) {
    const idx = indexOfExercise(exercise);
    if (idx >= 0) {
      exercises.value.splice(idx, 1);
      exerciseSets.value.splice(idx, 1);
      // full recompute for simplicity after removal
      recomputeAllVolumes();
    }
  }

  function updateMultipliers(newVals: {
    setsPerWeekMax: number;
    synergisticMultiplier: number;
    stabilizingMultiplier: number;
  }) {
    setsPerWeekMax.value = newVals.setsPerWeekMax;
    synergisticMultiplier.value = newVals.synergisticMultiplier;
    stabilizingMultiplier.value = newVals.stabilizingMultiplier;

    MuscleHelper.SYNERGIC_MULTIPLIER = newVals.synergisticMultiplier;
    MuscleHelper.STABILIZING_MULTIPLIER = newVals.stabilizingMultiplier;

    // Recompute all muscle volumes with the new multipliers / cap
    recomputeAllVolumes();
    // trigger reactivity by cloning array so watchers update
    presetMuscles.value = [...presetMuscles.value];
  }

  /* ---------------- volume calculations ---------------- */
  function recalcMuscleVolumes(exercise: Exercise, sets: number) {
    exercise.muscleInExercises.forEach((mi: MuscleInExercise) => {
      const muscle = presetMuscles.value.find((m) => m.id === mi.muscleId);
      if (!muscle) return;
      if (mi.muscleMovementCategory === "primary") muscle.addPrimarySets(sets);
      else if (mi.muscleMovementCategory === "synergistic") muscle.addSynergicSets(sets);
      else if (mi.muscleMovementCategory === "stabilizing") muscle.addStabilizingSets(sets);
    });
    presetMuscles.value = [...presetMuscles.value];
  }

  function recomputeAllVolumes() {
    presetMuscles.value = MuscleHelper.initializeMuscleList();
    exercises.value.forEach((ex, idx) => recalcMuscleVolumes(ex, exerciseSets.value[idx]));
  }

    /**
   * Compatibility wrapper used by legacy components.
   * Will be removed after full Phase-03 migration.
   */
  /**
   * Legacy API – keeps existing call sites working.
   * Positive `sets` will add volume, non-positive `sets` will remove the exercise completely.
   */
  function addMuscleLoadToPlan(exercise: Exercise, sets: number) {
    if (sets > 0) {
      addExercise(exercise, sets);
    } else {
      removeExercise(exercise);
    }
  }

  return {
    /* state */
    exercises,
    exerciseSets,
    exercisesArray: exercises,
    exercisesArraySets: exerciseSets,
    presetMuscles,
    // legacy alias
    presetMuscleArray: presetMuscles,
    setsPerWeekMax,
    synergisticMultiplier,
    stabilizingMultiplier,
    /* actions */
    addExercise,
    removeExercise,
    addMuscleLoadToPlan,
    updateMultipliers,
  };
});
