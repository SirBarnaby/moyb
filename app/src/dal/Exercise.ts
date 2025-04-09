import { defineStore } from "pinia";
import { ref } from "vue";
import type { MuscleInExercise } from "./MuscleInExercise";
import { exerciseRepository } from "@/main.ts";

export type Exercise = {
  id: string;
  name: string;
  description?: string;
  equipmentRequired?: string;
  movementType?: string;
  popularity?: number;
  rangeOfMotion?: number;
  injuryRiskFactor?: string;
  jointStressFactor?: string;
  cnsFatigueFactor?: string;
  isUnilateral: boolean;
  isHighSpinalLoad: boolean;
  createdAt: string;
  updatedAt: string;
  musclesAffected: MuscleInExercise[]
}

export const useExerciseStore
  = defineStore("exercise", () => {
  const exercises = ref<Exercise[]>([]);
  function loadExercisesByTargetMuscle(targetMuscle: string) {
    exerciseRepository
      .findByTargetMuscle(targetMuscle)
      .then(dbExercises => exercises.value = dbExercises)
  }

  return { exercises, loadExercisesByTargetMuscle };
});
