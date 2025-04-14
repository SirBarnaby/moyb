import { defineStore } from "pinia";
import { ref } from "vue";
import { muscleRepository } from "@/main.ts";

export type Muscle = {
  id: number;
  name: string;
  nameLatin?: string;
  description?: string;
  dominantFiberType?: string;
  enduranceRatingFactor?: string;
  recoveryTimeFactor?: string;
  neuralDriveSensitivityFactor?: string;
  motorUnitRecruitmentSpeedFactor?: string;
  stretchSensitivityFactor?: string;
  eccentricStrengthFactor?: string;
  createdAt: string;
  updatedAt: string;
}

export const useMuscleStore
  = defineStore("muscle", () => {
  const muscle = ref<Muscle | null>(null);
  function loadMuscleByName(name: string) {
    muscleRepository
      .search(name)
      .then(dbMuscles => {
        // Find exact match (case-insensitive)
        const exactMatch = dbMuscles.find(m => m.name.toLowerCase() === name.toLowerCase());
        if (exactMatch) {
          muscle.value = exactMatch;
        } else if (dbMuscles.length > 0) {
          // Fallback to first result if no exact match
          muscle.value = dbMuscles[0];
        }
      })
  }
  return { muscle, loadMuscleByName };
})
