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
  const muscleLoads = ref<Map<string, number>>(new Map());
  const setsPerWeekMax = ref(20);
  const synergisticMultiplier = ref(0.5);
  const stabilizingMultiplier = ref(0.25);
  
  function addExerciseAndSetsToWeek(exerciseToAdd: Exercise, sets: number) {
    // If this exercise already exists, UPDATE EXISTING.
    if (exercisesArray.value?.includes(exerciseToAdd)) {
      const newSets = [...exercisesArraySets.value]
      const index = exercisesArray.value?.indexOf(exerciseToAdd)

      newSets[index] += sets
      
      // If sets are now zero or negative, remove the exercise
      if (newSets[index] <= 0) {
        exercisesArray.value.splice(index, 1)
        exercisesArraySets.value.splice(index, 1)
      } else {
        exercisesArraySets.value = newSets
      }
    // If exercise DOESNT exist and sets are positive, add new exercise.
    } else if (sets > 0) {
      exercisesArray.value.push(exerciseToAdd)
      exercisesArraySets.value.push(sets)
    }
  }

  function removeExerciseFromWeek(exerciseToRemove: Exercise) {
    const indexToRemove = exercisesArray.value.indexOf(exerciseToRemove)
    exercisesArray.value.splice(indexToRemove, 1)
    exercisesArraySets.value.splice(indexToRemove, 1)
  }
  
  function addMuscleLoadToPlan(exercise: Exercise, sets: number) {
    if (!exercise.muscleInExercises || !Array.isArray(exercise.muscleInExercises)) {
      console.error(`[WorkoutPlan] Exercise "${exercise.name}" has no muscleInExercises array`);
      return;
    }
    
    console.log(`[WorkoutPlan] Adding exercise: ${exercise.name} (${sets} sets)`);
    
    // For EACH muscle worked in the target exercise...
    exercise.muscleInExercises.forEach(function (muscleInExercise) {
      // subjectMuscle == The muscle in our already populated
      // list of muscles, where we will add values
      const subjectMuscle = presetMuscleArray.value.find(
          muscle => muscle.id === muscleInExercise.muscleId)
      if (!subjectMuscle) {
        console.error(`[WorkoutPlan] Could not find muscle with ID ${muscleInExercise.muscleId} for exercise "${exercise.name}"`);
        return;
      }
      
      // Add sets based on movement category
      if (muscleInExercise.muscleMovementCategory === "primary") {
        subjectMuscle.addPrimarySets(sets)
      } else if (muscleInExercise.muscleMovementCategory === "synergistic") {
        subjectMuscle.addSynergicSets(sets)
      } else if (muscleInExercise.muscleMovementCategory === "stabilizing") {
        subjectMuscle.addStabilizingSets(sets)
      }
    });
    
    // Force Vue to detect the changes by creating a new array
    presetMuscleArray.value = [...presetMuscleArray.value];
    
    // Add the exercise to the workout plan
    addExerciseAndSetsToWeek(exercise, sets);
  }

  function updateMultipliers(newValues: {
    setsPerWeekMax: number;
    synergisticMultiplier: number;
    stabilizingMultiplier: number;
  }) {
    setsPerWeekMax.value = newValues.setsPerWeekMax;
    synergisticMultiplier.value = newValues.synergisticMultiplier;
    stabilizingMultiplier.value = newValues.stabilizingMultiplier;

    // Update the multipliers in MuscleHelper
    MuscleHelper.SYNERGIC_MULTIPLIER = newValues.synergisticMultiplier;
    MuscleHelper.STABILIZING_MULTIPLIER = newValues.stabilizingMultiplier;

    // Force Vue to detect the changes by creating a new array
    presetMuscleArray.value = [...presetMuscleArray.value];
  }

  return { 
    exercisesArray, 
    exercisesArraySets, 
    presetMuscleArray, 
    muscleLoads,
    setsPerWeekMax,
    synergisticMultiplier,
    stabilizingMultiplier,
    addMuscleLoadToPlan,
    updateMultipliers
  };
});
