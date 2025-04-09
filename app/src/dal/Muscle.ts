import { defineStore } from "pinia";
import { ref } from "vue";
import { muscleRepository } from "@/main.ts";

export type Muscle = {
  id: string;
  name: string;
  nameLatin?: string;
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
}

export const useMuscleStore
  = defineStore("muscle", () => {
  const muscle = ref<Muscle[]>([]);
  function loadMuscleByName(name: string) {
    muscleRepository
      .search(name)
      .then(dbMuscles => muscle.value = dbMuscles)
  }
  return { muscle, loadMuscleByName };
})
