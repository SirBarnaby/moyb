import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { Exercise } from "@/dal/Exercise.ts";
import { MuscleHelper } from "@/bll/MuscleHelper.ts";
import type { MuscleInExercise } from "@/dal/MuscleInExercise.ts";

export const useBusinessLogicStore
  = defineStore("workoutPlan", () => {
  const exercisesArray = ref<Exercise[]>([])
  const exercisesArraySets = ref<number[]>([])
  const muscleLoadArray = ref<MuscleHelper[]>(MuscleHelper.initializeMuscleList())
  function addExerciseAndSetsToWeek(exerciseToAdd: Exercise, sets: number) {
    // If this exercise already exists, UPDATE EXISTING.
    if (exercisesArray.value?.includes(exerciseToAdd)) {
      const newSets = [...exercisesArraySets.value]
      const index = exercisesArray.value?.indexOf(exerciseToAdd)

      newSets[index] += sets
      exercisesArraySets.value = newSets
    // If exercise DOESNT exist, add new exercise.
    } else {
      exercisesArray.value.push(exerciseToAdd)
      exercisesArraySets.value.push(sets)
    }
  }

  function removeExerciseAndSetsFromWeek(exerciseToRemove: Exercise) {
    const indexToRemove = exercisesArray.value.indexOf(exerciseToRemove)
    exercisesArray.value.splice(indexToRemove, 1)
    exercisesArraySets.value.splice(indexToRemove, 1)
  }
  function addMuscleLoadToPlan(exercise: Exercise, sets: number) {
    exercise.musclesAffected.forEach(function (element) {
      const subjectMuscle =
        muscleLoadArray.value.find(
          item => item.id == element.muscle_id)
      if (element.muscle_movement_category == "primary") {
      }
      if (element.muscle_movement_category == "synergistic") {
      }
      if (element.muscle_movement_category == "stabilizing") {
      }
      });
    for (const muscle in exercise.musclesAffected) {

    }
  }

  return {  };
});
