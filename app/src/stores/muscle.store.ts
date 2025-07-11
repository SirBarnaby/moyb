import { defineStore } from "pinia";
import { ref } from "vue";
import { Muscle } from "@/core/muscle/Muscle.entity";
import { muscleRepository } from "@/main";

/**
 * AI-Primer: This Pinia store manages the state for a single muscle.
 * It handles loading a muscle by its name and is used for displaying muscle details.
 */
export const useMuscleStore = defineStore("muscle", () => {
  const muscle = ref<Muscle | null>(null);

  async function loadMuscleByName(name: string) {
    try {
      const dbMuscles = await muscleRepository.search(name);
      const exactMatch = dbMuscles.find(
        (m) => m.name.toLowerCase() === name.toLowerCase()
      );

      if (exactMatch) {
        // The repository returns plain objects; we map them to domain entities.
        muscle.value = Muscle.create(exactMatch);
      } else if (dbMuscles.length > 0) {
        // Fallback to the first result if no exact match is found.
        muscle.value = Muscle.create(dbMuscles[0]);
      } else {
        muscle.value = null;
      }
    } catch (error) {
      console.error(`Failed to load muscle "${name}":`, error);
      muscle.value = null;
    }
  }

  return { muscle, loadMuscleByName };
});
