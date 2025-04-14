import { defineStore } from "pinia";
import { ref } from "vue";
import type { MuscleInExercise } from "./MuscleInExercise";
import { exerciseRepository } from "@/main.ts";

export class Exercise {
  id?: string;
  name?: string;
  description?: string;
  equipmentRequired?: string;
  movementType?: string;
  popularity?: number;
  rangeOfMotion?: number;
  injuryRiskFactor?: string;
  jointStressFactor?: string;
  cnsFatigueFactor?: string;
  isUnilateral?: boolean;
  isHighSpinalLoad?: boolean;
  createdAt?: string;
  updatedAt?: string;
  mainMuscle?: string;
  imageUrl?: string;
  muscleInExercises: MuscleInExercise[];

  constructor() {
    this.muscleInExercises = [];
  }

  public getAffectedMuscles() {
    return this.muscleInExercises;
  }

  public isCalisthenics() {
    return this.equipmentRequired?.toLowerCase().includes("bodyweight") ?? false;
  }

  public isSpecial() {
    return this.movementType?.toLowerCase().includes("special") ?? false;
  }  
}

export const useAllExercisesStore
  = defineStore("exercise", () => {
  const exercises = ref<Exercise[]>([]);
  const isSearchActive = ref(false);

  function loadAllExercisesByTargetMuscle(targetMuscle: string) {
    isSearchActive.value = false;
    exerciseRepository
      .findByTargetMuscle(targetMuscle)
      .then(dbExercises => exercises.value = dbExercises)
  }

  function setSearchResults(results: Exercise[]) {
    isSearchActive.value = true;
    exercises.value = results;
  }

  return { 
    exercises, 
    loadAllExercisesByTargetMuscle,
    isSearchActive,
    setSearchResults
  };
});
