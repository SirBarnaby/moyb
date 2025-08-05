<script setup lang="ts">
import { useWorkoutPlanStore } from "@/stores/workoutPlan.store";
import { computed, ref, watch } from "vue";
// ScrollArea component removed - using native scrollbars instead
import { Card, CardContent } from '@/components/ui/card'
import { X, Plus, Minus, Save, FolderOpen } from 'lucide-vue-next';
import { ExerciseRepository } from "@/repositories/ExerciseRepository";
import { Exercise } from "@/core/exercise/Exercise.entity";

// Define props for visibility control
const props = defineProps<{
  visible?: boolean
}>();

const bllStore = useWorkoutPlanStore();
const exerciseRepository = new ExerciseRepository();

// Track previous muscle volumes for change detection
const previousMuscleVolumes = ref<Record<string, number>>({});
const muscleFlashState = ref<Record<string, 'increased' | 'decreased' | null>>({});

const activeMuscles = computed(() => {
  return bllStore.presetMuscleArray.filter(m => m.getTotalSetVolume() > 0);
});

// Watch for changes in muscle volumes and update flash states
watch(activeMuscles, (newMuscles) => {
  const currentVolumes = Object.fromEntries(
    newMuscles.map(m => [m.id, m.getTotalSetVolume()])
  );

  // Check for changes and update flash states
  Object.entries(currentVolumes).forEach(([id, volume]) => {
    const previousVolume = previousMuscleVolumes.value[id] || 0;

    if (volume > previousVolume) {
      muscleFlashState.value[id] = 'increased';
      setTimeout(() => {
        muscleFlashState.value[id] = null;
      }, 250);
    } else if (volume < previousVolume && previousVolume > 0) {
      muscleFlashState.value[id] = 'decreased';
      setTimeout(() => {
        muscleFlashState.value[id] = null;
      }, 250);
    }
  });

  // Update previous volumes for next comparison
  previousMuscleVolumes.value = currentVolumes;
}, { deep: true });

const exercises = computed(() => {
  if (!bllStore.exercisesArray || !bllStore.exercisesArraySets) return [];
  return bllStore.exercisesArray.map((exercise, index) => ({
    exercise,
    sets: bllStore.exercisesArraySets[index]
  }));
});

const incrementExercise = (exercise: any, currentSets: number) => {
  bllStore.updateExerciseSets(exercise, currentSets + 1);
}

const decrementExercise = (exercise: any, currentSets: number) => {
  bllStore.updateExerciseSets(exercise, currentSets - 1);
}

// New methods for save/load functionality
const saveWorkout = () => {
  const workoutData = {
    exercises: exercises.value.map(item => {
      // Create new MuscleInExercise instances for each exercise
      const muscleInExercises = item.exercise.muscleInExercises.map(mie => ({
        exerciseId: -1,
        muscleId: mie.muscleId,
        contractionType: "[omitted]",
        fatigueAccumulationFactor: "[omitted]",
        muscleMovementCategory: mie.muscleMovementCategory
      }));

      return {
        name: item.exercise.name,
        sets: item.sets,
        muscleInExercises
      };
    })
  };

  const blob = new Blob([JSON.stringify(workoutData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `workout-${new Date().toISOString().slice(0,10)}.moyb`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const loadWorkout = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.moyb';

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const contents = await file.text();
      const workoutData = JSON.parse(contents);

      // Reset current workout to clear all exercises and muscle groups
      bllStore.reset();

      // Load exercises directly from file data
      for (const savedExercise of workoutData.exercises) {
        // Create Exercise entity directly from the saved data
        const exerciseEntity = Exercise.create({
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique string ID
          name: savedExercise.name,
          description: "[omitted]",
          equipmentRequired: "[omitted]",
          movementType: "[omitted]",
          popularity: -1,
          rangeOfMotion: -1,
          injuryRiskFactor: "[omitted]",
          jointStressFactor: "[omitted]",
          cnsFatigueFactor: "[omitted]",
          isUnilateral: false,
          isHighSpinalLoad: false,
          mainMuscle: "[omitted]",
          imageUrl: "[omitted]",
          muscleInExercises: savedExercise.muscleInExercises || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        // Add the exercise with the saved set count
        bllStore.addExercise(exerciseEntity, savedExercise.sets);
        console.log(`Loaded exercise: ${savedExercise.name} with ${savedExercise.sets} sets`);
      }
    } catch (error) {
      console.error('Error loading workout file:', error);
      alert('Error loading workout file. Please check the file format.');
    }
  };

  input.click();
};
</script>

<template>
  <div v-if="exercises.length > 0 && visible"
       class="workout-log-card"
       :class="{ 'slide-in': visible }">

    <!-- Header -->
    <div class="card-header flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-black tracking-tight">
          Your Volume
        </h1>
      </div>

      <div class="flex space-x-2">
        <button
          @click="saveWorkout"
          class="save-button flex items-center p-1.5 rounded-md transition-all"
          title="Save workout"
        >
          <Save :size="14" />
        </button>
        <button
          @click="loadWorkout"
          class="load-button flex items-center p-1.5 rounded-md transition-all"
          title="Load workout"
        >
          <FolderOpen :size="14" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-2 space-y-2 overflow-y-auto">
      <!-- Muscle Groups Section -->
      <div class="space-y-1">
        <div class="scroll-container" :style="{ maxHeight: activeMuscles.length > 4 ? '140px' : 'auto' }">
          <TransitionGroup name="fade" tag="div" class="grid grid-cols-2 gap-1.5 muscle-groups">
            <div
              v-if="activeMuscles.length === 0"
              class="col-span-2 flex justify-center items-center p-2.5 bg-black/5 border border-black/10 rounded-lg"
              key="no-muscles"
            >
              <span class="text-black/60 font-medium text-sm">No muscles worked yet</span>
            </div>
            <div
              v-for="muscle in activeMuscles"
              :key="muscle.id"
              class="muscle-item"
              :class="{
                'muscle-increased': muscleFlashState[muscle.id] === 'increased',
                'muscle-decreased': muscleFlashState[muscle.id] === 'decreased',
                'muscle-normal': !muscleFlashState[muscle.id]
              }"
            >
              <span class="text-black/80 font-medium capitalize text-sm">{{ muscle.nameOfMuscle }}</span>
              <span class="text-blue-800 font-bold text-sm bg-blue-500/20 px-1 py-0.5 rounded-full">
                {{ muscle.getTotalSetVolume().toFixed(1) }}
              </span>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Exercises Section -->
      <div class="space-y-1">
        <div class="exercises-divider">
          <h2 class="text-sm font-semibold text-black/90 mb-1">Exercises</h2>
        </div>
        <div class="scroll-container" :style="{ maxHeight: exercises.length > 5 ? '180px' : 'auto' }">
          <TransitionGroup name="fade" tag="div" class="space-y-1 exercises-container">
            <Card
              v-for="(item, index) in exercises"
              :key="item.exercise.id || index"
              class="exercise-item bg-black/5 border-black/10 hover:bg-black/10 transition-all duration-200"
            >
              <CardContent class="flex items-center justify-between p-1.5">
                <div class="flex items-center space-x-1.5 flex-1">
                  <button
                    @click="bllStore.updateExerciseSets(item.exercise, 0)"
                    class="text-red-400 hover:text-red-300 transition-colors duration-200 p-1"
                    title="Remove exercise"
                  >
                    <X :size="14" />
                  </button>
                  <span class="text-black/80 font-medium capitalize text-sm flex-1">{{ item.exercise.name }}</span>
                </div>

                <div class="flex items-center space-x-1">
                  <span class="text-black/70 font-bold text-sm min-w-[1.5rem] text-center">{{ item.sets }}</span>
                  <button
                    @click="decrementExercise(item.exercise, item.sets)"
                    :disabled="item.sets <= 1"
                    class="control-button minus"
                    :class="{ 'opacity-50 cursor-not-allowed': item.sets <= 1 }"
                    title="Decrement set"
                  >
                    <Minus :size="14" />
                  </button>
                  <button
                    @click="incrementExercise(item.exercise, item.sets)"
                    class="control-button plus"
                    title="Increment set"
                  >
                    <Plus :size="14" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

.text-2xl {
font-size: 1.3rem;
}

.text-sm {
line-height: 1.25rem;
font-size: 1.1rem;
}

/* Flash animation */
@keyframes flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.muscle-flash {
  animation: flash 0.3s 2;
}

/* Animation keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    filter: blur(0);
  }
  to {
    opacity: 0;
    filter: blur(4px);
  }
}

/* Transition classes */
.fade-enter-active {
  animation: fadeIn 0.3s ease-out forwards;
}

.fade-leave-active {
  animation: fadeOut 0.3s ease-in forwards;
  position: absolute;
  width: calc(100% - 20px);
  pointer-events: none;
}

.fade-move {
  transition: transform 0.3s ease;
}

/* Ensure proper layout during animations */
.muscle-groups,
.exercises-container {
  position: relative;
}

.muscle-item {
  background-color: rgba(0, 0, 0, 0.03);
  filter: invert(5%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.muscle-normal {
  background-color: rgba(0, 0, 0, 0.03);
}

.muscle-normal:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.muscle-increased {
  background-color: rgba(209, 250, 229, 0.7);
}

.muscle-decreased {
  background-color: rgba(254, 226, 226, 0.7);
}

.exercise-item {
  transition: all 0.3s ease;
}

.workout-log-card {
  font-family: 'Poppins', sans-serif;
  position: fixed;
  width: 30%;
  min-width: 85vw;
  min-height: 40vh; 
  max-height: 85vh;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(24px);
  box-shadow: 17px 17px 20px 10px rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header {
  cursor: grab;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 4px;
  padding-bottom: 4px;
  padding-right: 6px;
  padding-left: 10px;
  backdrop-filter: blur(24px) contrast(1.5);
}

.card-header:active {
  cursor: grabbing;
}

.muscle-groups {
  text-shadow: 0px 0px 2px rgba(255, 255, 255, 0.2);
}

.control-button {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
}

.control-button.plus {
    background-color: rgba(34, 197, 94, 0.8);
    color: white;
}
.control-button.plus:hover {
    background-color: rgba(34, 197, 94, 1);
    transform: scale(1.1);
}

.control-button.minus {
    background-color: rgba(59, 130, 246, 0.8);
    color: white;
}
.control-button.minus:hover {
    background-color: rgba(59, 130, 246, 1);
    transform: scale(1.1);
}

/* Scroll container styling */
.scroll-container {
  overflow-y: auto;
  padding-right: 0.25rem;
  transition: max-height 0.4s ease-in-out;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1);
}

/* Webkit scrollbar styling (Chrome, Safari, Edge) */
.scroll-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scroll-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.inverted-card {
  backdrop-filter: blur(24px);
}

/* Firefox scrollbar styling */
@supports (scrollbar-color: auto) {
  .scroll-container {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1);
  }
}

.save-button {
  background-color: rgba(55, 65, 81, 0.8); /* dark gray */
  backdrop-filter: blur(10px) contrast(1.25);
  color: white;
}

.load-button {
  background-color: transparent;
  backdrop-filter: blur(10px) contrast(1.25);
  border: 1px solid rgba(55, 65, 81, 0.5);
  color: rgba(55, 65, 81, 0.8);
}

.save-button:hover, .load-button:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

/* Exercises divider styling */
.exercises-divider {
  display: flex;
  align-items: center;
  width: 100%;
}

.exercises-divider::before,
.exercises-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.2);
}

.exercises-divider h2 {
  padding: 0 10px;
  margin: 0;
  white-space: nowrap;
}

/* Sliding panel animation */
.workout-log-card {
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.workout-log-card.slide-in {
  transform: translateX(0);
}
</style>
