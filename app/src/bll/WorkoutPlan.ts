import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { Exercise } from "@/dal/Exercise.ts";
import { MuscleHelper } from "@/bll/MuscleHelper.ts";
import type { MuscleInExercise } from "@/dal/MuscleInExercise.ts";

export const useBusinessLogicStore
  = defineStore("workoutPlan", () => {
  const exercisesArray = ref<Exercise[]>([])
  const exercisesArraySets = ref<number[]>([])
  const presetMuscleArray = ref<MuscleHelper[]>(MuscleHelper.initializeMuscleList())
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
    // For EACH muscle worked in the target exercise...
    exercise.musclesAffected.forEach(function (muscleInExercise) {
      // subjectMuscle == The muscle in our already populated
      // list of muscles, where we will add values
      const subjectMuscle = presetMuscleArray.value.find(
          muscle => muscle.id == muscleInExercise.muscle_id)
      if (muscleInExercise.muscle_movement_category == "primary") {
        subjectMuscle!.addPrimarySets(sets)
      }
      if (muscleInExercise.muscle_movement_category == "synergistic") {
        subjectMuscle!.addSynergicSets(sets)
      }
      if (muscleInExercise.muscle_movement_category == "stabilizing") {
        subjectMuscle!.addStabilizingSets(sets)
      }
      });
  }
  return { presetMuscleArray, addMuscleLoadToPlan };
});
