<script setup lang="ts">
import { type Exercise, useAllExercisesStore } from "@/dal/Exercise.ts";
import { computed, ref, onMounted, watch, nextTick } from "vue";
import { useMuscleStore } from "@/dal/Muscle.ts";
import { useBusinessLogicStore } from "@/bll/WorkoutPlan.ts";
import { MuscleHelper } from "@/bll/MuscleHelper.ts";
import { setCSSTintForMuscle } from "@/bll/CSSHelper.ts";
import ExerciseDossier from "@/components/ExerciseDossier.vue";

const exerciseStore = useAllExercisesStore();
const muscleStore = useMuscleStore();
const bllStore = useBusinessLogicStore();
const exercises = computed(() => exerciseStore.exercises);
const targetMuscle = computed(() => muscleStore.muscle);

// Loading states
const isLoading = ref(true);
const loadedImages = ref(new Set());
const shouldRender = ref(false);

// Create an array for skeleton loader
const skeletonArray = ref(Array(6).fill(0).map((_, i) => i));

// Add state for hover effects
const hoveredExercise = ref<Exercise | null>(null);
const selectedExerciseForHighlight = ref<Exercise | null>(null);
const originalMuscleColors = ref<Map<string, string>>(new Map());

// Add prop for search mode
const props = defineProps<{
  isSearchMode?: boolean
}>();

// Initialize component
onMounted(async () => {
  // Always set shouldRender to true on mount
  if (exercises.value.length > 0) {
    isLoading.value = false;
    shouldRender.value = true;
  }

  // Add CSS for slow fade transition to all muscle elements
  addSlowFadeToMuscles();
});

// Add slow fade transition to all muscle elements
const addSlowFadeToMuscles = () => {
  // Get all muscle groups from SVG
  const muscleGroups = document.querySelectorAll('[id^="abs"], [id^="front"], [id^="side"], [id^="rear"], [id^="biceps"], [id^="triceps"], [id^="traps"], [id^="lats"], [id^="chest"], [id^="quads"], [id^="glutes"], [id^="hamstrings"], [id^="calves"], [id^="forearm"]');

  muscleGroups.forEach(group => {
    const paths = group.getElementsByTagName('path');
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i] as SVGPathElement;
      path.style.transition = 'fill 100ms ease';
    }
  });
};

// Watch for exercise changes to update loading state
watch(exercises, (newExercises) => {
  if (newExercises.length > 0) {
    // Ensure loading ends and content renders when exercises load
    isLoading.value = false;
    shouldRender.value = true;
  }
}, { immediate: true });

// Watch for muscle changes to reset loading state
watch(targetMuscle, async (newMuscle, oldMuscle) => {
  if (!newMuscle) return;

  // Only run transition if it's not the initial render or if changing muscles
  if (oldMuscle) {
    shouldRender.value = false;
    isLoading.value = true;

    // Clear loaded images cache
    loadedImages.value = new Set();

    // Wait for data to load
    await nextTick();

    // Reveal content after a short delay
    setTimeout(() => {
      isLoading.value = false;
      shouldRender.value = true;
    }, 200);
  } else {
    // For initial muscle selection, immediately show content
    isLoading.value = false;
    shouldRender.value = true;
  }
});

// Handle image load
const handleImageLoaded = (exerciseId) => {
  loadedImages.value.add(exerciseId);
};

// Check if exercise image is loaded
const isImageLoaded = (exerciseId) => {
  return loadedImages.value.has(exerciseId);
};

// Helper functions for determining exercise properties
const isCalisthenics = (exercise: Exercise) => {
  return exercise.equipmentRequired?.toLowerCase().includes("bodyweight") ?? false;
};

const isSpecial = (exercise: Exercise) => {
  return exercise.movementType?.toLowerCase().includes("special") ?? false;
};

// State for midway step
const selectedExercise = ref<Exercise | null>(null);
const showExerciseDossier = ref(false);

// Function to show exercise detail
const showExerciseDetails = (exercise: Exercise) => {
  emit('toggle-popup', false);

  selectedExercise.value = exercise;
  selectedExerciseForHighlight.value = exercise; // Store the selected exercise for highlighting
  showExerciseDossier.value = true;

  // Apply highlighting to the selected exercise
  highlightMusclesOnHover(exercise);

  emit('exercise-selected', exercise);
};

// Handler for adding exercise to plan
const handleAddToPlan = (data: { exercise: Exercise, sets: number }) => {
  bllStore.addMuscleLoadToPlan(data.exercise, data.sets);
  closeDossier();

  emit('exercise-selected', data.exercise);
};

// Handler for closing dossier
const closeDossier = () => {
  showExerciseDossier.value = false;
  selectedExercise.value = null;
  selectedExerciseForHighlight.value = null; // Clear the selected exercise
  resetMuscleHighlighting(); // Reset highlighting when closing the dossier
};

// Function to highlight muscles on hover
const highlightMusclesOnHover = (exercise: Exercise) => {
  hoveredExercise.value = exercise;

  // Highlight related muscles
  if (exercise && exercise.muscleInExercises) {
    exercise.muscleInExercises.forEach(muscleInExercise => {
      const muscleName = MuscleHelper.getMuscleNameById(muscleInExercise.muscleId);
      if (muscleName) {
        const elementId = getMuscleElementId(muscleName);

        // Use different intensity based on muscle role
        let intensity = 0;
        if (muscleInExercise.muscleMovementCategory === "primary") {
          intensity = 15; // Primary - full intensity
        } else if (muscleInExercise.muscleMovementCategory === "synergistic") {
          intensity = 10; // Synergistic - medium intensity
        } else {
          intensity = 5; // Stabilizing - low intensity
        }

        setCSSTintForMuscle(elementId, intensity);
      }
    });
  }
};

// Function to reset muscle highlighting
const resetMuscleHighlighting = () => {
  if (hoveredExercise.value) {
    hoveredExercise.value = null;

    // If there's a selected exercise, maintain its highlighting
    if (selectedExerciseForHighlight.value) {
      highlightMusclesOnHover(selectedExerciseForHighlight.value);
      return;
    }

    // If a targetMuscle is selected, maintain its highlighting
    if (targetMuscle.value) {
      // Restore all muscles to their original state based on workout plan
      bllStore.presetMuscleArray.forEach(muscle => {
        const elementId = getMuscleElementId(muscle.nameOfMuscle);
        const totalVolume = muscle.getTotalSetVolume();
        setCSSTintForMuscle(elementId, totalVolume);
      });
    } else {
      // Reset all muscles to default
      const muscleGroups = document.querySelectorAll('[id^="abs"], [id^="front"], [id^="side"], [id^="rear"], [id^="biceps"], [id^="triceps"], [id^="traps"], [id^="lats"], [id^="chest"], [id^="quads"], [id^="glutes"], [id^="hamstrings"], [id^="calves"], [id^="forearm"]');

      muscleGroups.forEach(group => {
        setCSSTintForMuscle(group.id, 0);
      });
    }
  }
};

// Helper function to map muscle names to SVG IDs
const getMuscleElementId = (muscleName: string): string => {
  const muscleIdMap: Record<string, string> = {
    'Front Delts': 'frontdelts',
    'Anterior Delts': 'frontdelts',
    'Side Delts': 'sidedelts',
    'Lateral Delts': 'sidedelts',
    'Rear Delts': 'reardelts',
    'Posterior Delts': 'reardelts',
    'Forearm Extensors': 'forearmextendors',
    'Forearm Flexors': 'forearmflexors',
    'Lower Back': 'lowerback',
    'Rotator Cuff': 'rotatorcuff',
    'Trapezius': 'traps',
    'Abs': 'abs'
  };

  return muscleIdMap[muscleName] ||
         muscleName.toLowerCase().replace(/\s+/g, '');
};

const emit = defineEmits(['toggle-popup', 'exercise-selected']);
</script>

<template>
  <div class="exerciseselectormain" v-show="!showExerciseDossier">
    <div class="exerciseselectortop" v-if="!isSearchMode && targetMuscle">
      <div class="hoverablearrow" @click="emit('toggle-popup')">
        <div class="arrow-icon"></div>
      </div>
      <div class="exerciseselectortopdivider">
        <div class="exerciseselectortopleft">
          <div class="describingtext">{{ targetMuscle?.description }}</div>
        </div>
        <div class="exerciseselectortopright">
          <div class="muscle-name-container">
            <div class="esmusclegroup">{{ targetMuscle?.name }}</div>
            <div class="esmusclegrouplatin">{{ targetMuscle?.nameLatin }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="exerciseselectorall" :class="{ 'search-mode': isSearchMode }">
      <!-- Skeleton loader -->
      <div v-if="isLoading" class="skeleton-container">
        <div v-for="index in skeletonArray" :key="`skeleton-${index}`" class="exerciseselectoritem skeleton">
          <div class="exerciseselectorcard1">
            <div class="skeleton-title"></div>
            <div class="div-block">
              <div class="skeleton-icon"></div>
              <div class="skeleton-icon"></div>
            </div>
            <div class="muscles-container">
              <div class="skeleton-muscle-list">
                <div class="skeleton-tag"></div>
                <div class="skeleton-tag"></div>
                <div class="skeleton-tag"></div>
              </div>
            </div>
          </div>
          <div class="exerciseselectorcard2 skeleton-image">
            <div class="skeleton-img-placeholder"></div>
          </div>
        </div>
      </div>

      <!-- Exercise content -->
      <div v-else-if="shouldRender && exercises.length > 0" class="exercise-content fade-in">
        <div
          v-for="exercise in exercises"
          :key="exercise.id"
          class="exerciseselectoritem"
          @click="showExerciseDetails(exercise)"
          @mouseenter="highlightMusclesOnHover(exercise)"
          @mouseleave="resetMuscleHighlighting()"
        >
          <div class="exerciseselectorcard1">
            <h3 class="exercise-title">{{ exercise.name }}</h3>
            <div class="div-block">
              <img v-if="exercise.isUnilateral" class="image-4" src="/blue-warning.png" title="This exercise is unilateral, meaning it only works one side of the body at a time.">
              <img v-if="exercise.isHighSpinalLoad" class="image-4" src="/red-warning.png" title="This exercise puts a lot of weight/stress on the spine.">
              <img v-if="isCalisthenics(exercise)" class="image-4" src="/bodyweight-warning.png" title="This exercise is calisthenics, meaning it is done without any equipment.">
              <img v-if="isSpecial(exercise)" class="image-4" src="/dynamic-warning.png" title="This exercise combines multiple exercises.">
            </div>
            <div class="muscles-container">
              <div class="muscle-list">
                <!-- Primary muscles first -->
                <span
                  v-for="muscleInExercise in exercise.muscleInExercises.filter(m => m.muscleMovementCategory?.toLowerCase() === 'primary')"
                  :key="`primary-${muscleInExercise.muscleId}`"
                  class="muscle-tag primary-muscle"
                >
                  {{ MuscleHelper.getMuscleNameById(muscleInExercise.muscleId) }}
                </span>
                
                <!-- Synergistic muscles second -->
                <span
                  v-for="muscleInExercise in exercise.muscleInExercises.filter(m => m.muscleMovementCategory?.toLowerCase() === 'synergistic')"
                  :key="`synergistic-${muscleInExercise.muscleId}`"
                  class="muscle-tag synergistic-muscle"
                >
                  {{ MuscleHelper.getMuscleNameById(muscleInExercise.muscleId) }}
                </span>
                
                <!-- Stabilizing muscles last -->
                <span
                  v-for="muscleInExercise in exercise.muscleInExercises.filter(m => m.muscleMovementCategory?.toLowerCase() === 'stabilizing')"
                  :key="`stabilizing-${muscleInExercise.muscleId}`"
                  class="muscle-tag stabilizing-muscle"
                >
                  {{ MuscleHelper.getMuscleNameById(muscleInExercise.muscleId) }}
                </span>
              </div>
            </div>
          </div>
          <div class="exerciseselectorcard2">
            <!-- Skeleton image while loading -->
            <div v-if="!isImageLoaded(exercise.id)" class="skeleton-img-placeholder pulse"></div>

            <!-- Actual image with lazy loading -->
            <img
              class="image-3"
              :src="exercise.imageUrl"
              loading="lazy"
              @load="handleImageLoaded(exercise.id)"
              :class="{ 'image-loaded': isImageLoaded(exercise.id) }"
            >
          </div>
        </div>
      </div>

      <!-- No exercises message -->
      <div v-else-if="shouldRender && exercises.length === 0" class="no-exercises-message">
        No exercises found for this muscle group
      </div>
    </div>
  </div>

  <!-- Exercise Dossier Component -->
  <ExerciseDossier
    :exercise="selectedExercise"
    :visible="showExerciseDossier"
    @close="closeDossier"
    @add-to-plan="handleAddToPlan"
  />
</template>

<style scoped>
.exerciseselectormain {
  height: 80%;
  margin-top: auto;
  position: relative;
  z-index: 2;
  font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
  transition: height 0.3s ease;
}

/* Fade animation */
.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hoverablearrow {
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.hoverablearrow:hover {
  transform: translateY(-2px);
}

.arrow-icon {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 15px solid #000;
  transition: transform 0.3s;
}

.exerciseselectortopdivider {
  width: 100%;
  height: 80%;
  display: flex;
}

.exerciseselectortopleft {
  width: 70%;
  height: 100%;
  margin-left: 15px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.describingtext {
  font-size: 0.85em;
  line-height: 1.4;
  font-weight: 500;
  width: 100%;
  height: 100%;
  padding-left: 4px;
  padding-right: 4px;
  overflow-y: auto;
  color: #333;
  letter-spacing: -0.5px;
  text-align: left;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.05);
}

.exerciseselectoritem {
  display: flex;
  height: 120px;
  margin: 11px 10px;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 0 15px 0px hsla(0, 0%, 0%, 0.28);
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.31), rgba(151, 151, 151, 0.29));
}

.exerciseselectorcard1 {
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 100%;
  padding-right: 10px;
  justify-content: space-between;
}

.exercise-title {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  text-transform: uppercase;
  font-weight: 800;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: Inter, sans-serif;
  letter-spacing: -2px;
  width: 100%;
}

.div-block {
  display: flex;
  height: 20px;
  margin-bottom: 5px;
  justify-content: flex-start;
  gap: 3px;
}

.image-4 {
  height: 100%;
  width: auto;
  margin-right: 2px;
}

.muscles-container {
  flex-grow: 1;
  overflow: visible;
  margin-top: 8px;
}

.muscle-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: left;
}

.muscle-tag {
  display: inline-block;
  font-size: 0.75rem;
  padding: 2px 5px;
  margin: 0;
  white-space: nowrap;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  font-family: Inter, sans-serif;
  font-weight: 500;
}

.primary-muscle {
  background: linear-gradient(135deg, rgba(39, 174, 96, 0.92), rgba(16, 141, 76, 0.92));
  border: 2px solid #a1e3c4;
  color: white;
}

.synergistic-muscle {
  background: linear-gradient(135deg, rgba(85, 239, 151, 0.9), rgba(66, 221, 132, 0.9));
  border: 2px solid #c6ffe0;
  color: white;
}

.stabilizing-muscle {
  background: linear-gradient(135deg, rgba(200, 214, 229, 0.92), rgba(131, 149, 167, 0.92));
  border: 2px solid #dfe6e9;
  color: white;
}

.exerciseselectorcard2 {
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  position: relative;
}

.image-3 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-loaded {
  opacity: 1;
}

.exerciseselectorall {
  overflow-y: auto;
  max-height: 80vh;
  scrollbar-width: thin;
  scrollbar-color: lime transparent;
}

.exerciseselectorall.search-mode {
  height: 100%;
}

.exerciseselectorall::-webkit-scrollbar {
  width: 8px;
}

.exerciseselectorall::-webkit-scrollbar-track {
  background: transparent;
}

.exerciseselectorall::-webkit-scrollbar-thumb {
  background-color: lime;
  border-radius: 4px;
}

/* Skeleton loading styles */
.skeleton {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(200, 200, 200, 0.35));
}

.skeleton-title {
  height: 20px;
  width: 80%;
  background-color: rgba(200, 200, 200, 0.4);
  border-radius: 4px;
  margin-bottom: 5px;
}

.skeleton-icon {
  height: 20px;
  width: 20px;
  background-color: rgba(200, 200, 200, 0.4);
  border-radius: 50%;
  margin-right: 5px;
}

.skeleton-muscle-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.skeleton-tag {
  height: 18px;
  width: 60px;
  background-color: rgba(200, 200, 200, 0.4);
  border-radius: 3px;
  margin-bottom: 5px;
}

.skeleton-image {
  background-color: rgba(210, 210, 210, 0.4);
}

.skeleton-img-placeholder {
  width: 100%;
  height: 100%;
  background-color: rgba(210, 210, 210, 0.4);
  position: absolute;
  top: 0;
  left: 0;
}

/* Pulse animation for skeletons */
.pulse {
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 0.3; }
  100% { opacity: 0.6; }
}

/* Media query for 900x1440 display */
@media (max-width: 900px) and (min-height: 1440px) {
  .exerciseselectorall {
    max-height: 70vh;
  }

  .exerciseselectoritem {
    height: 130px;
  }

  .exerciseselectorcard1 {
    width: 65%;
  }

  .exerciseselectorcard2 {
    width: 35%;
  }
}

.no-exercises-message {
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
  color: #666;
  font-weight: 500;
}

.exerciseselectortopright {
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0 8px;
}

.muscle-name-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.esmusclegroup {
  font-size: clamp(0.9rem, 2.5vw, 1.3rem);
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 4px;
  width: 100%;
  line-height: 1.2;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.esmusclegrouplatin {
  font-size: clamp(0.75rem, 2vw, 1rem);
  font-style: italic;
  color: #666;
  text-align: center;
  width: 100%;
  line-height: 1.2;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

@media (max-width: 600px) {
  .exerciseselectortopdivider {
    flex-direction: column;
  }

  .exerciseselectortopleft,
  .exerciseselectortopright {
    width: 100%;
  }

  .exerciseselectortopright {
    margin-top: 10px;
  }

  .describingtext {
    max-height: 80px;
  }
}
</style>
