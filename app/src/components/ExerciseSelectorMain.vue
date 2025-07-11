<script setup lang="ts">
import { useAllExercisesStore } from "@/stores/exercise.store";
import type { Exercise } from "@/core/exercise/Exercise.entity";
import { computed, ref, onMounted, watch, nextTick } from "vue";
import { useMuscleStore } from "@/stores/muscle.store";
import ExerciseSelectorPopup from "@/components/ExerciseSelectorPopup.vue";
import { useWorkoutPlanStore } from "@/stores/workoutPlan.store";
import { MuscleHelper } from "@/bll/MuscleHelper.ts";
import type { MuscleInExercise } from '@/core/muscle/MuscleInExercise.entity';
import { getMuscleColorByVolume } from "@/common/CSSHelper.ts";
import ExerciseDossier from "@/components/ExerciseDossier.vue";

const exerciseStore = useAllExercisesStore();
const muscleStore = useMuscleStore();
const bllStore = useWorkoutPlanStore();
const exercises = computed(() => exerciseStore.exercises);
const targetMuscle = computed(() => muscleStore.muscle);

// Helper to apply color tint to a muscle group using pure color calculator
const applyTintToMuscle = (elementId: string, setsPerWeek: number) => {
  const group = document.getElementById(elementId);
  if (!group || !(group instanceof SVGElement)) return;
  const maxSets = bllStore.setsPerWeekMax || 1;
  const hexColor = getMuscleColorByVolume(setsPerWeek, maxSets);
  const paths = group.getElementsByTagName('path');
  for (let i = 0; i < paths.length; i++) {
    (paths[i] as SVGPathElement).style.fill = hexColor;
  }
};

// Loading states
const isLoading = ref(true);
const loadedImages = ref(new Set());
const shouldRender = ref(false);

// Add state for hover effects
const hoveredExercise = ref<Exercise | null>(null);
const selectedExerciseForHighlight = ref<Exercise | null>(null);

// Add prop for search mode
const props = defineProps<{
  isSearchMode?: boolean
}>();

// Initialize component
onMounted(async () => {
  if (exercises.value.length > 0) {
    isLoading.value = false;
    shouldRender.value = true;
  }
  addSlowFadeToMuscles();
});

// Add slow fade transition to all muscle elements
const addSlowFadeToMuscles = () => {
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
    isLoading.value = false;
    shouldRender.value = true;
  }
}, { immediate: true });

// Watch for muscle changes to reset loading state
watch(targetMuscle, async (newMuscle, oldMuscle) => {
  if (!newMuscle) return;
  if (oldMuscle) {
    shouldRender.value = false;
    isLoading.value = true;
    loadedImages.value = new Set();
    await nextTick();
    setTimeout(() => {
      isLoading.value = false;
      shouldRender.value = true;
    }, 200);
  } else {
    isLoading.value = false;
    shouldRender.value = true;
  }
});

// Handle image load
const handleImageLoaded = (exerciseId: string) => {
  loadedImages.value.add(exerciseId);
};

const isImageLoaded = (exerciseId: string) => {
  return loadedImages.value.has(exerciseId);
};

// Helper functions for determining exercise properties
const isCalisthenics = (exercise: Exercise) => exercise.equipmentRequired?.toLowerCase().includes("bodyweight") ?? false;
const isSpecial = (exercise: Exercise) => exercise.movementType?.toLowerCase().includes("special") ?? false;

// State for midway step
const selectedExercise = ref<Exercise | null>(null);
const showExerciseDossier = ref(false); // True when any dossier is open
const isMuscleDossierOpen = ref(false); // True when muscle dossier is open (partial view)
const isExerciseDossierOpen = ref(false); // True when exercise dossier is open (fullscreen)
const popupHeight = ref('0%');


// Function to show exercise detail (fullscreen)
const showExerciseDetails = (exercise: Exercise) => {
  selectedExercise.value = exercise;
  selectedExerciseForHighlight.value = exercise;
  showExerciseDossier.value = true;
  isExerciseDossierOpen.value = true;
  isMuscleDossierOpen.value = false;
  popupHeight.value = '100%';
  highlightMusclesOnHover(exercise);
  emit('exercise-selected', exercise);
};

// Function to toggle muscle data panel (partial view)
const toggleMuscleData = () => {
  if (isMuscleDossierOpen.value) {
    closeDossier();
  } else if (exercises.value.length > 0) {
    const firstExercise = exercises.value[0];
    selectedExercise.value = firstExercise;
    selectedExerciseForHighlight.value = firstExercise;
    showExerciseDossier.value = true;
    isMuscleDossierOpen.value = true;
    isExerciseDossierOpen.value = false;
    popupHeight.value = '18%';
    highlightMusclesOnHover(firstExercise);
    emit('exercise-selected', firstExercise);
  }
};

// Handler for adding exercise to plan
const handleAddToPlan = (data: { exercise: Exercise, sets: number }) => {
  bllStore.addMuscleLoadToPlan(data.exercise, data.sets);
  closeDossier();
  emit('exercise-selected', data.exercise);
};

// Handler for closing any dossier
const closeDossier = () => {
  showExerciseDossier.value = false;
  isMuscleDossierOpen.value = false;
  isExerciseDossierOpen.value = false;
  popupHeight.value = '0%';
  selectedExercise.value = null;
  selectedExerciseForHighlight.value = null;
  resetMuscleHighlighting();
};

// Function to highlight muscles on hover
const highlightMusclesOnHover = (exercise: Exercise) => {
  hoveredExercise.value = exercise;
  if (exercise?.muscleInExercises) {
    exercise.muscleInExercises.forEach(muscleInExercise => {
      const muscleName = MuscleHelper.getMuscleNameById(muscleInExercise.muscleId);
      if (muscleName) {
        const elementId = getMuscleElementId(muscleName);
        let intensity = 0;
        if (muscleInExercise.muscleMovementCategory === "primary") intensity = 15;
        else if (muscleInExercise.muscleMovementCategory === "synergistic") intensity = 10;
        else intensity = 5;
        applyTintToMuscle(elementId, intensity);
      }
    });
  }
};

// Function to reset muscle highlighting
const resetMuscleHighlighting = () => {
  if (hoveredExercise.value) {
    hoveredExercise.value = null;
    if (selectedExerciseForHighlight.value) {
      highlightMusclesOnHover(selectedExerciseForHighlight.value);
      return;
    }
    if (targetMuscle.value) {
      bllStore.presetMuscleArray.forEach(muscle => {
        const elementId = getMuscleElementId(muscle.nameOfMuscle);
        const totalVolume = muscle.getTotalSetVolume();
        applyTintToMuscle(elementId, totalVolume);
      });
    } else {
      const muscleGroups = document.querySelectorAll('[id^="abs"], [id^="front"], [id^="side"], [id^="rear"], [id^="biceps"], [id^="triceps"], [id^="traps"], [id^="lats"], [id^="chest"], [id^="quads"], [id^="glutes"], [id^="hamstrings"], [id^="calves"], [id^="forearm"]');
      muscleGroups.forEach(group => {
        applyTintToMuscle(group.id, 0);
      });
    }
  }
};

// Helper function to map muscle names to SVG IDs
const getMuscleElementId = (muscleName: string): string => {
  const muscleIdMap: Record<string, string> = {
    'Front Delts': 'frontdelts', 'Anterior Delts': 'frontdelts',
    'Side Delts': 'sidedelts', 'Lateral Delts': 'sidedelts',
    'Rear Delts': 'reardelts', 'Posterior Delts': 'reardelts',
    'Forearm Extensors': 'forearmextendors', 'Forearm Flexors': 'forearmflexors',
    'Lower Back': 'lowerback', 'Rotator Cuff': 'rotatorcuff',
    'Trapezius': 'traps', 'Abs': 'abs'
  };
  return muscleIdMap[muscleName] || muscleName.toLowerCase().replace(/\s+/g, '');
};

const emit = defineEmits(['toggle-popup', 'exercise-selected']);
</script>

<template>
  <div class="new-container" :class="{ 'visible': targetMuscle }">
    <div class="new-inner-container">
      <!-- Popup Container -->
      <div
        class="popup-container"
        :style="{ height: popupHeight, margin: popupHeight !== '0%' ? '0 12px 0 12px' : '0' }"
      >
        <div class="popup-content-wrapper" :class="{ 'visible': showExerciseDossier }">
          <ExerciseSelectorPopup
            :is-visible="showExerciseDossier"
            :exercise="selectedExercise"
            :is-muscle-dossier-open="isMuscleDossierOpen"
            :is-exercise-dossier-open="isExerciseDossierOpen"
            @close="closeDossier"
            @add-to-plan="handleAddToPlan"
          />
        </div>
      </div>

      <!-- Header Section -->
      <div class="new-header" :class="{ 'popup-is-open': popupHeight !== '0%' }" v-show="!isExerciseDossierOpen && targetMuscle">
        <div class="new-header-content">
          <button class="new-toggle-button" @click="toggleMuscleData" :class="{ 'active': isMuscleDossierOpen }" title="Show muscle data">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bar-chart-3"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
          </button>
          <div class="new-header-flex">
            <div class="new-text-section">
              <p class="new-description-text">{{ targetMuscle?.description }}</p>
            </div>
            <div class="new-title-section">
              <h1 class="new-main-title">{{ targetMuscle?.name?.toUpperCase() }}</h1>
              <p class="new-subtitle">{{ targetMuscle?.nameLatin }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Container (Exercise List) -->
      <div class="main-content-container" v-show="!isExerciseDossierOpen">
        <div class="new-scroll-container">
          <div class="new-scrollable-area fancy-scrollbar">
            <!-- Skeleton Loader -->
            <div v-if="isLoading" class="skeleton-container">
              <div v-for="i in 6" :key="i" class="new-exercise-card skeleton"></div>
            </div>

            <!-- Exercise Content -->
            <div v-else>
              <div
                v-for="exercise in exercises"
                :key="exercise.id"
                class="new-exercise-card"
                @click="showExerciseDetails(exercise)"
                @mouseenter="highlightMusclesOnHover(exercise)"
                @mouseleave="resetMuscleHighlighting()"
              >
                <div class="new-card-content">
                  <div class="new-card-flex">
                    <div class="new-card-left">
                      <div class="new-title-row">
                        <img v-if="exercise.isUnilateral" class="image-4" src="/blue-warning.png" title="This exercise is unilateral, meaning it only works one side of the body at a time.">
                        <img v-if="exercise.isHighSpinalLoad" class="image-4" src="/red-warning.png" title="This exercise puts a lot of weight/stress on the spine.">
                        <img v-if="isCalisthenics(exercise)" class="image-4" src="/bodyweight-warning.png" title="This exercise is calisthenics, meaning it is done without any equipment.">
                        <img v-if="isSpecial(exercise)" class="image-4" src="/dynamic-warning.png" title="This exercise combines multiple exercises.">

                        <h3 class="new-exercise-title">{{ exercise.name }}</h3>
                      </div>
                      <div class="new-tags-container">
                        <span v-for="m in exercise.muscleInExercises.filter(m => m.muscleMovementCategory === 'primary')" :key="m.muscleId" class="new-tag primary-muscle">
                          {{ MuscleHelper.getMuscleNameById(m.muscleId) }}
                        </span>
                        <span v-for="m in exercise.muscleInExercises.filter(m => m.muscleMovementCategory === 'synergistic')" :key="m.muscleId" class="new-tag synergistic-muscle">
                          {{ MuscleHelper.getMuscleNameById(m.muscleId) }}
                        </span>
                        <span v-for="m in exercise.muscleInExercises.filter(m => m.muscleMovementCategory === 'stabilizing')" :key="m.muscleId" class="new-tag stabilizing-muscle">
                          {{ MuscleHelper.getMuscleNameById(m.muscleId) }}
                        </span>
                      </div>
                    </div>
                    <div class="new-image-container">
                      <div v-if="!isImageLoaded(exercise.id)" class="skeleton-img-placeholder pulse"></div>
                      <img
                        :src="exercise.imageUrl"
                        :alt="exercise.name"
                        class="new-image"
                        loading="lazy"
                        @load="handleImageLoaded(exercise.id)"
                        :class="{ 'image-loaded': isImageLoaded(exercise.id) }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Base container styles from carcass */
.new-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 562px; /* Sidebar width */
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: transform 0.5s ease-in-out;
  transform: translateX(-100%); /* Start off-screen by default */
}
.new-container.visible {
  transform: translateX(0); /* Slide in when .visible is added */
}

.popup-container {
  position: relative;
  overflow: hidden;
  transition: height 0.4s ease-in-out, margin 0.4s ease-in-out;
  flex-shrink: 0;
}

.popup-content-wrapper {
  transform: translateY(-100%);
  transition: transform 0.4s ease-in-out;
  height: 100%;
  width: 100%;
}
.popup-content-wrapper.visible {
  transform: translateY(0);
}

.main-content-container {
  flex-grow: 1; /* Let this take remaining space */
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.new-scroll-container {
  height: 100%;
  overflow-y: auto;
  position: relative;
  z-index: 1000; /* Ensure it's on top */
  padding-right: 15px;
  overflow: hidden;
  font-family: 'Geist Sans', sans-serif; /* Corrected font name */
  transition: transform 0.3s ease-in-out;
  backdrop-filter: blur(0px); /* 40px */
  background-clip: padding-box;
}

.new-inner-container {
  width: 100%;
  height: 100%;
  /* New gradient inspired by child elements */
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.78), rgba(59, 130, 246, 0.15));
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header styles */
.new-header {
  margin: 0 12px 8px 12px;
  backdrop-filter: blur(40px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  transition: margin-top 0.4s ease-in-out;
}

.new-header.popup-is-open {
    margin-top: 8px;
}

.new-header-content {
  padding: 16px;
  display: flex;
  gap: 16px;
}

.new-toggle-button {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(229,231,235,0.5) 100%);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  flex-shrink: 0;
}
.new-toggle-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.25);
}
.new-toggle-button.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.7) 100%);
  color: white;
  box-shadow: 0 5px 10px -3px rgba(0, 0, 0, 0.3);
}


.new-header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  flex-grow: 1;
}

.new-text-section {
  flex: 1;
  /* Removed max-height and overflow-y to allow the container to grow */
}

.new-description-text {
  color: #1c1c1c;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 600;
}

.new-title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
  height: 100%;
  text-align: right;
}

.new-main-title {
  font-size: 23px;
  font-weight: bold;
  color: #1c1c1c;
  margin-bottom: -4px;
  letter-spacing: -0.025em;
}

.new-subtitle {
  color: #1c1c1c;
  font-style: italic;
  font-size: 14px;
  font-weight: 600;
}

/* Scroll container styles */
.new-scroll-container {
  flex: 1;
  overflow: hidden;
  margin-left: 12px;
  margin-right: 12px;
  margin-bottom: 12px;
}

.new-scrollable-area {
  height: 100%;
  overflow-y: auto;
  padding-right: 8px;
}

/* Exercise card styles */
.new-exercise-card {
  position: relative;
  backdrop-filter: blur(40px);
  box-shadow: 0 0px 5px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.15s;
  flex-shrink: 0;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  margin-bottom: 12px;
  min-height: 11vh;
  cursor: pointer;
  display: flex; /* Make the card a flex container */
}
.new-exercise-card:hover {
    box-shadow: 0 0px 5px 3px rgba(0, 0, 0, 0);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.904) 0%, rgba(165, 230, 122, 0.46) 100%),
              linear-gradient(135deg, rgba(230,230,230,0.2) 0%, rgba(200,200,200,0.2) 100%);
}

.new-card-content {
  padding: 8px;
  display: flex; /* Make this a flex container */
  flex-direction: column; /* Stack children vertically */
  width: 100%; /* Ensure it takes full width */
}

.new-card-flex {
  display: flex;
  align-items: stretch; /* Changed from center to stretch */
  justify-content: space-between;
  width: 100%;
  flex-grow: 1; /* Allow this to grow and fill space */
}

.new-card-left {
  flex: 1;
  min-width: 0;
}

.new-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-bottom: 12px;
  margin-top: 5px;
  line-height: 0.9;
  white-space: normal;
}

.new-exercise-title {
  font-family: 'Inter', sans-serif; /* Use Inter font */
  font-weight: bold; /* Make exercise names bold */
  text-transform: uppercase;
  color: #1f2937;
  letter-spacing: -0.025em;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 24px;
}

.new-icon-container {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  padding: 4px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-4 {
  width: 20px;
  height: 20px;
  margin-right: 0px;
  object-fit: contain;
}

/* Special styles for letter icons */
.u-icon, .t-icon {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    font-weight: bold;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.u-icon { background-color: rgba(59, 130, 246, 0.8); }
.t-icon { background-color: rgba(168, 85, 247, 0.8); }


.new-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.new-tag {
  backdrop-filter: blur(4px);
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  font-weight: 500;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.2s;
  border-radius: 4px;
}
.new-tag:hover {
    transform: translateY(-1px);
}

/* Muscle tag colors based on original logic */
.primary-muscle { background-color: rgb(0, 214, 107); }
.synergistic-muscle { background-color: rgb(130, 175, 187); }
.stabilizing-muscle { background-color: rgb(180, 180, 180); }


.new-image-container {
  width: 33%;
  aspect-ratio: 6 / 4;
  align-self: stretch; /* Allow container to fill flex height */
  flex-shrink: 0;
  margin-left: 12px;
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.1);
  position: relative;
  box-shadow: 0 5px 20px 0px rgba(0, 0, 0, 0.25);
}

.new-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
  filter: drop-shadow(0 0 8px rgba(0,0,0,0.15));
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.image-loaded {
  opacity: 1;
}

/* Skeleton loader styles */
.skeleton {
  opacity: 0.5;
  animation: pulse 1.5s infinite ease-in-out;
  background: rgba(200,200,200,0.3);
}
@keyframes pulse {
  0% { background-color: rgba(200,200,200,0.3); }
  50% { background-color: rgba(200,200,200,0.5); }
  100% { background-color: rgba(200,200,200,0.3); }
}
.skeleton-img-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background-color: rgba(200,200,200,0.5);
}
.pulse {
  animation: pulse 1.5s infinite ease-in-out;
}

/* Fancy scrollbar with trail effect */
.fancy-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.4) transparent;
}

.fancy-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.fancy-scrollbar::-webkit-scrollbar-track {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(200, 200, 200, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
}

.fancy-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.6) 0%,
    rgba(220, 220, 220, 0.8) 30%,
    rgba(200, 200, 200, 0.9) 70%,
    rgba(180, 180, 180, 0.7) 100%
  );
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 0 12px rgba(255, 255, 255, 0.3);
  position: relative;
}

.fancy-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(230, 230, 230, 0.9) 30%,
    rgba(210, 210, 210, 1) 70%,
    rgba(190, 190, 190, 0.8) 100%
  );
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 0 16px rgba(255, 255, 255, 0.5);
}

.fancy-scrollbar::-webkit-scrollbar-thumb:active {
  background: linear-gradient(
    to bottom,
    rgba(240, 240, 240, 0.9) 0%,
    rgba(220, 220, 220, 1) 50%,
    rgba(200, 200, 200, 0.9) 100%
  );
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 255, 255, 0.6);
}

/* Trail effect animation */
.fancy-scrollbar::-webkit-scrollbar-thumb::before {
  content: "";
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
  border-radius: 10px 10px 0 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fancy-scrollbar::-webkit-scrollbar-thumb::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
  border-radius: 0 0 10px 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fancy-scrollbar:hover::-webkit-scrollbar-thumb::before,
.fancy-scrollbar:hover::-webkit-scrollbar-thumb::after {
  opacity: 1;
}

</style>