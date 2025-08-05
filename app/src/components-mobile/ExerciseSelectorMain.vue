<script setup lang="ts">
import { useAllExercisesStore } from "@/stores/exercise.store";
import type { Exercise } from "@/core/exercise/Exercise.entity";
import { computed, ref, onMounted, watch, nextTick, onUnmounted, reactive } from "vue";
import { useMuscleStore } from "@/stores/muscle.store";
import ExerciseSelectorPopup from "@/components/mobile/ExerciseSelectorPopup.vue";
import ExerciseDossier from "@/components/mobile/ExerciseDossier.vue";
import MuscleHeaderPopup from "@/components/mobile/MuscleHeaderPopup.vue";
import { useWorkoutPlanStore } from "@/stores/workoutPlan.store";
import { MuscleHelper } from "@/bll/MuscleHelper.ts";
import { getMuscleColorByVolume } from "@/common/CSSHelper.ts";
import { CONSTANTS } from '@/config/mobile-detector';

// Stores
const exerciseStore = useAllExercisesStore();
const muscleStore = useMuscleStore();
const bllStore = useWorkoutPlanStore();

// Props
defineProps<{ isSearchMode?: boolean }>();

// Emits
const emit = defineEmits(['toggle-popup', 'exercise-selected']);

// Computed properties from stores
const exercises = computed(() => exerciseStore.exercises);
const targetMuscle = computed(() => muscleStore.muscle);

// Consolidated reactive state
const uiState = reactive({
  isLoading: true,
  isComponentVisible: false,
  isDossierVisible: false
});

const exerciseState = reactive({
  hovered: null as Exercise | null,
  selected: null as Exercise | null
});

type DossierState = 'closed' | 'muscle';
const dossierState = reactive({
  current: 'closed' as DossierState,
  isMuscleHeaderVisible: false
});

// DOM refs
const exerciseSelectorMainRef = ref<HTMLElement | null>(null);

// Muscle element cache for performance
const muscleElementCache = new Map<string, Element>();

const popupHeight = computed(() => {
  return dossierState.current === 'muscle' ? '18%' : '0%';
});

const isDossierOpen = computed(() => dossierState.current !== 'closed');

// --- Methods ---

const closeDossier = () => {
  dossierState.current = 'closed';
  resetMuscleHighlighting();
};

const closeExerciseDossier = () => {
  // Only proceed if the dossier is actually visible
  if (uiState.isDossierVisible) {
    // First reset highlighting
    resetMuscleHighlighting();

    // Hide the dossier
    uiState.isDossierVisible = false;

    // Ensure the main component remains visible
    uiState.isComponentVisible = true;

    // Reset the selected exercise
    exerciseState.selected = null;

    // Reset muscle highlighting
    resetMuscleHighlighting();
  }
};

const toggleMuscleData = () => {
  if (dossierState.current === 'muscle') {
    closeDossier();
  } else {
    dossierState.current = 'muscle';
  }
};

const showExerciseDetails = (exercise: Exercise) => {
  exerciseState.selected = exercise;
  uiState.isDossierVisible = true;
  highlightMusclesOnHover(exercise);
};

const handleAddToPlan = (data: { exercise: Exercise, sets: number }) => {
  bllStore.addMuscleLoadToPlan(data.exercise, data.sets);
  // Reset the UI state to close the dossier
  uiState.isDossierVisible = false;
  uiState.isComponentVisible = true;
  exerciseState.selected = null;
  resetMuscleHighlighting();
  emit('exercise-selected', data.exercise);
};

// --- Muscle Highlighting Logic ---

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

// Optimized muscle tinting with caching
const applyTintToMuscle = (elementId: string, setsPerWeek: number) => {
  let group = muscleElementCache.get(elementId);
  if (!group) {
    const element = document.getElementById(elementId);
    if (element && element instanceof SVGElement) {
      group = element;
      muscleElementCache.set(elementId, group);
    } else {
      return;
    }
  }

  const maxSets = bllStore.setsPerWeekMax || 1;
  const hexColor = getMuscleColorByVolume(setsPerWeek, maxSets);
  const paths = (group as SVGElement).getElementsByTagName('path');
  for (let i = 0; i < paths.length; i++) {
    (paths[i] as SVGPathElement).style.fill = hexColor;
  }
};

const highlightMusclesOnHover = (exercise: Exercise | null) => {
  exerciseState.hovered = exercise;
  if (!exercise) return;

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
};

const resetMuscleHighlighting = () => {
  if (!exerciseState.hovered) return;
  exerciseState.hovered = null;

  if (exerciseState.selected) {
    highlightMusclesOnHover(exerciseState.selected);
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
};

// --- Lifecycle and Watchers ---

onMounted(() => {
  const muscleGroups = document.querySelectorAll('[id^="abs"], [id^="front"], [id^="side"], [id^="rear"], [id^="biceps"], [id^="triceps"], [id^="traps"], [id^="lats"], [id^="chest"], [id^="quads"], [id^="glutes"], [id^="hamstrings"], [id^="calves"], [id^="forearm"]');
  muscleGroups.forEach(group => {
    const paths = group.getElementsByTagName('path');
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i] as SVGPathElement;
      path.style.transition = 'fill 100ms ease';
    }
  });
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Track if we're currently processing an add button click
let isProcessingAdd = false;

const handleClickOutside = (event: MouseEvent) => {
  // Early return if component is already not visible
  if (!uiState.isComponentVisible || isProcessingAdd) return;

  const target = event.target as HTMLElement;

  // Check if this is an add button click
  if (target.closest('.select-button')) {
    isProcessingAdd = true;
    setTimeout(() => {
      isProcessingAdd = false;
    }, 100);
    return;
  }

  // Don't close if clicking within the main component or its children
  if (exerciseSelectorMainRef.value?.contains(target)) {
    return;
  }

  // Get all dossier elements including any potential portals
  const dossierElements = Array.from(document.querySelectorAll('.exercise-dossier, [data-dossier]'));
  const isClickInDossier = dossierElements.some(el => el.contains(target));

  // Don't close if clicking on any dossier element or its children
  if (isClickInDossier || uiState.isDossierVisible) {
    return;
  }

  // Only close if we're not in the middle of a transition
  uiState.isComponentVisible = false;
};

watch(exercises, (newExercises) => {
  uiState.isLoading = newExercises.length === 0;
}, { immediate: true });

watch(targetMuscle, (newMuscle) => {
  if (newMuscle) {
    nextTick(() => {
      uiState.isComponentVisible = true;
    });
  } else {
    uiState.isComponentVisible = false;
  }
});

// --- Image Loading Helpers (Optimized with Map) ---
const imageLoadingState = reactive({
  loadedImages: new Map<string, boolean>()
});

const handleImageLoaded = (exerciseId: string) => {
  imageLoadingState.loadedImages.set(exerciseId, true);
};

const isImageLoaded = (exerciseId: string) => {
  return imageLoadingState.loadedImages.get(exerciseId) ?? false;
};

// --- Exercise Type Helpers ---
const isCalisthenics = (exercise: Exercise) => exercise.equipmentRequired?.toLowerCase().includes("bodyweight") ?? false;
const isSpecial = (exercise: Exercise) => exercise.movementType?.toLowerCase().includes("special") ?? false;

// --- Filtering Logic ---

const searchQuery = ref('');

const filters = ref({
  calisthenics: true,
  unilateral: true,
  highSpinalLoad: true,
  special: true,
});

const toggleFilter = (filterName: keyof typeof filters.value) => {
  filters.value[filterName] = !filters.value[filterName];
};

const filteredExercises = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  return exercises.value.filter(exercise => {
    // Icon filters
    if (!filters.value.calisthenics && isCalisthenics(exercise)) return false;
    if (!filters.value.unilateral && exercise.isUnilateral) return false;
    if (!filters.value.highSpinalLoad && exercise.isHighSpinalLoad) return false;
    if (!filters.value.special && isSpecial(exercise)) return false;

    // Search query filter
    if (query && !exercise.name.toLowerCase().includes(query)) {
      return false;
    }

    return true;
  });
});

</script>

<template>
  <div ref="exerciseSelectorMainRef" v-show="targetMuscle" class="new-container" :class="{ 'visible': uiState.isComponentVisible, 'dossier-open': uiState.isDossierVisible }">
    <!-- New backdrop element -->
    <div class="backdrop" :class="{ 'active': uiState.isDossierVisible }"></div>
    <div class="new-inner-container">
      <!-- Popup Container -->
      <div
        class="popup-container"
        :style="{ height: popupHeight, margin: popupHeight !== '0%' ? '0 12px 0 12px' : '0' }"
      >
        <div class="popup-content-wrapper" :class="{ 'visible': isDossierOpen }">
          <ExerciseSelectorPopup
            :is-visible="isDossierOpen"
            @close="closeDossier"
          />
        </div>
      </div>

      <!-- Title section -->
      <div class="new-title-section">
        <h1 class="new-main-title">{{ targetMuscle?.name?.toUpperCase() }}</h1>
        <p class="new-subtitle">{{ targetMuscle?.nameLatin }}</p>
      </div>

            <!-- Search and Filter Section -->
      <div class="search-filter-container">
        <div class="filter-button-container">
          <button @click="toggleFilter('calisthenics')" :class="{ active: filters.calisthenics }" class="filter-button" title="Toggle Calisthenics">
            <img src="/bodyweight-warning.png" alt="Calisthenics">
          </button>
          <button @click="toggleFilter('unilateral')" :class="{ active: filters.unilateral }" class="filter-button" title="Toggle Unilateral">
            <img src="/blue-warning.png" alt="Unilateral">
          </button>
          <button @click="toggleFilter('highSpinalLoad')" :class="{ active: filters.highSpinalLoad }" class="filter-button" title="Toggle High Spine Stress">
            <img src="/red-warning.png" alt="High Spine Stress">
          </button>
          <button @click="toggleFilter('special')" :class="{ active: filters.special }" class="filter-button" title="Toggle Special">
            <img src="/dynamic-warning.png" alt="Special">
          </button>
          <input type="text" v-model="searchQuery" placeholder="Search..." class="search-input" style="flex: 1; margin-left: 12px;">
        </div>
      </div>

      <!-- Main Content Container (Exercise List) -->
      <div class="main-content-container">
        <div class="new-scroll-container">
          <div class="new-scrollable-area fancy-scrollbar">
            <div v-if="uiState.isLoading" class="skeleton-container">
              <div v-for="i in 6" :key="i" class="new-exercise-card skeleton"></div>
            </div>
            <div v-else>
              <div
                v-for="exercise in filteredExercises"
                :key="exercise.id"
                class="new-exercise-card"
                @click="showExerciseDetails(exercise)"
                @mouseenter="highlightMusclesOnHover(exercise)"
                @mouseleave="resetMuscleHighlighting()"
              >
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
    <MuscleHeaderPopup
      :is-visible="dossierState.isMuscleHeaderVisible"
      @close="() => dossierState.isMuscleHeaderVisible = false"
    />
  </div>
  <ExerciseDossier
    v-if="uiState.isDossierVisible"
    :exercise="exerciseState.selected"
    :visible="uiState.isDossierVisible"
    @close="closeExerciseDossier"
    @add-to-plan="handleAddToPlan"
  />
</template>

<style scoped>

.new-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50vh;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 100;
}
.new-container.visible {
  transform: translateY(0);
}

.new-container.dossier-open .new-inner-container {
  transform: scale(0.98);
  transition: all 0.3s ease;
  pointer-events: none;
}

.new-inner-container {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.144);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
}

/* --- Popup --- */
.popup-container {
  position: relative;
  overflow: hidden;
  transition: height 0.4s ease-in-out, margin 0.4s ease-in-out;
  flex-shrink: 0;
}

.popup-content-wrapper {
  transform: translateY(-100%) ;
  transition: transform 0.4s ease-in-out;
  height: 100%;
  width: 100%;
}

.popup-content-wrapper.visible {
  transform: translateY(0);
}

/* --- Header --- */
.new-header {
  flex-shrink: 0;
  transition: all 0.4s ease-in-out;
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
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.2s;
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
  justify-content: flex-start;
  gap: 16px;
  height: 100%;
  flex-grow: 1;
}

/* --- Search Section --- */
.search-filter-container {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  gap: 10px;
}

.filter-button-container {
  display: flex;
  gap: 8px;
  margin-right: 10px;
}

.search-container {
  flex: 1;
  min-width: 0;
}

.filter-button {
  border-radius: 8px;
  padding: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-button img {
  width: 28px;
  height: 28px;
  transition: all 0.2s ease-in-out;
}

.filter-button:not(.active) {
  transform: scale(0.85);
}

.filter-button:not(.active) img {
  filter: grayscale(100%) blur(3px);
}

.filter-button.active {
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.filter-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0);
  border-radius: 12px;
  box-shadow: 0 0px 6px 6px rgba(0, 0, 0, 0.13);
  backdrop-filter: blur(24px);
  font-size: 16px;
  color: #1f2937;
  transition: all 0.2s ease-in-out;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.1em;
}

.search-input::placeholder {
  color: #6b7280;
}

.search-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

@media (max-width: 1239px) {
  .search-filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-container {
    justify-content: center;
    gap: 30px;
  }
}

.new-text-section {
  flex: 1;
  min-width: 60%;
}

.new-description-text {
  color: #1c1c1c;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 600;
}

.new-title-section {
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 16px;
  margin-bottom: 4px;
  border-radius: 0px;
  backdrop-filter: blur(48px) contrast(1.25);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.new-main-title {
  font-size: 21.75px;
  font-weight: 900;
  color: #1c1c1c;
  margin: 0;
  letter-spacing: -0.025em;
  overflow-wrap: break-word;
  white-space: normal;
  line-height: 1.2;
}

.new-subtitle {
  color: #1c1c1c;
  font-style: italic;
  font-size: 12px;
  font-weight: 400;
  margin: 0;
  line-height: 1.2;
}

/* --- Main Content & Scroll --- */
.main-content-container {
  flex-grow: 1;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.new-scroll-container {
  flex: 1;
  overflow: hidden;
  position: relative; /* Create stacking context */
  z-index: 2; /* Ensure it's on top of other elements */
}

.new-scrollable-area {
  height: 100%;
  overflow-y: auto;
  padding-right: 8px;
}

/* --- Exercise Card --- */
.new-exercise-card {
  position: relative;
  padding: 6px;
  min-height: 8.25vh;
  box-shadow: 0 0 9px 1px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  border-radius: 8px;
  margin-left: 8px;
  margin-bottom: 9px;
  cursor: pointer;
  display: flex;
  backdrop-filter: contrast(1.25);
}

.new-exercise-card:hover {
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.904) 0%, rgba(165, 230, 122, 0.7) 100%);
}

.new-exercise-card:active {
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.904) 0%, rgba(255, 255, 255, 0.8) 100%),
  linear-gradient(135deg, rgba(230,230,230,0.2) 0%, rgba(200,200,200,0.2) 100%);
}

.new-card-left {
  flex: 1;
  min-width: 0;
}

.new-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 9px;
  margin-top: 5px;
  line-height: 0.9;
  white-space: normal;
}

.new-exercise-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  color: #1f2937;
  letter-spacing: -0.025em;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 20px;
}

.image-4 {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.new-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.new-tag {
  font-family: 'Inter', sans-serif;
  color: white;
  font-size: 11px;
  padding: 3px 6px;
  font-weight: 600;
  box-shadow: 0 0px 6px 2px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: transform 0.2s;
  border-radius: 4px;
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.7);
}

.primary-muscle { background-image: linear-gradient(135deg, rgb(0, 214, 107), rgb(0, 193, 96)); }
.synergistic-muscle { background-image: linear-gradient(135deg, rgb(130, 175, 187), rgb(117, 158, 168)); }
.stabilizing-muscle { background-image: linear-gradient(135deg, rgb(180, 180, 180), rgb(162, 162, 162)); }

.new-image-container {
  width: 37%;
  aspect-ratio: 7 / 4;
  align-self: stretch;
  flex-shrink: 0;
  margin-left: 2px;
  margin: -2px;
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
  filter: drop-shadow(0 0 8px rgba(0,0,0,0.15));
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
.image-loaded {
  opacity: 1;
}

/* --- Skeleton Loader --- */
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

/* --- Scrollbar --- */
.fancy-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.4) transparent;
}
.fancy-scrollbar::-webkit-scrollbar { width: 8px; }
.fancy-scrollbar::-webkit-scrollbar-track { background: transparent; }
.fancy-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* New backdrop styles */
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(0px);
  background: rgba(255, 255, 255, 0);
  z-index: 5;
  pointer-events: none;
  opacity: 0;
  border-radius: 12px;
  transition: all 0.2s ease-out;
}

.backdrop.active {
  backdrop-filter: blur(4px) grayscale(80%);
  background: rgba(255, 255, 255, 0.1);
  opacity: 1;
}

/* Remove the old ::before implementation */
.new-container.dossier-open .new-inner-container::before {
  content: none;
}

</style>
