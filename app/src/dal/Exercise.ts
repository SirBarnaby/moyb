import { defineStore } from "pinia";
import { ref } from "vue";

type Exercise = {
  id: number
  name: string
  description: string
  muscles_worked: string[]
}

export const useExerciseStore = defineStore("exercise", () => {
  const exercises = ref<Exercise[]>([]);
  let ex1: Exercise = {id: 1, name: "Pushup", description: "Good ass exercise", muscles_worked: ["calves"]}
  let ex2: Exercise = {id: 2, name: "Pushup2", description: "Good ass exercise", muscles_worked: ["calves"]}
  let ex3: Exercise = {id: 3, name: "Pushup3", description: "Good ass exercise", muscles_worked: ["calves"]}
  function loadChestExercises() {
    exercises.value = [ex1, ex2, ex3];
  }

  return { exercises, loadChestExercises };
});

