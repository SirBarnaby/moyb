<script setup lang="ts">
import { type Exercise } from "@/dal/Exercise.ts";
import { ref, computed } from "vue";
import { MuscleHelper } from "@/bll/MuscleHelper.ts";

// Define props for the component
const props = defineProps<{
  exercise: Exercise | null,
  visible: boolean
}>();

// Initialize sets with default value
const setsPerWeek = ref(3);

// Define emits for interactions
const emit = defineEmits([
  'close', 
  'add-to-plan'
]);

// Function to add exercise to plan with specified sets
const addExerciseToPlan = () => {
  emit('add-to-plan', {
    exercise: props.exercise,
    sets: setsPerWeek.value
  });
};

// Function to close the dossier
const closeExerciseDetail = () => {
  emit('close');
};

// Helper function to get meter segments based on value
const getMeterSegments = (value: string | undefined) => {
  if (!value) return 0;
  
  switch(value) {
    case '1': return 1; // One segment for low values
    case '2': return 2; // Two segments for medium values
    case '3': return 3; // Three segments for high values
    default: return 0; // No segments for invalid values
  }
};

// Computed values for the meters
const injuryRiskSegments = computed(() => 
  getMeterSegments(props.exercise?.injuryRiskFactor)
);

const jointStressSegments = computed(() => 
  getMeterSegments(props.exercise?.jointStressFactor)
);

const cnsFatigueSegments = computed(() => 
  getMeterSegments(props.exercise?.cnsFatigueFactor)
);

// Emoji mapping based on muscle roles
const getEmoji = (muscleInExercise: any) => {
  // Use muscleMovementCategory to determine the role
  if (muscleInExercise.muscleMovementCategory === 'primary') return '💥'; // Primary muscles
  if (muscleInExercise.muscleMovementCategory === 'synergistic') return '🔥'; // Synergic muscles
  if (muscleInExercise.muscleMovementCategory === 'stabilizing') return '✨'; // Stabilizing muscles
  return '✨'; // Default emoji for any other case
};

// Add state for popup
const selectedMuscle = ref<any>(null);
const popupVisible = ref(false);
const popupPosition = ref({ top: 0, left: 0 });

// Function to handle mouse movement
const handleMouseMove = (muscle: any, event: MouseEvent) => {
  selectedMuscle.value = muscle;
  popupPosition.value = {
    top: event.clientY + 10,
    left: event.clientX + 10
  };
  popupVisible.value = true;
};

// Function to hide popup
const hidePopup = () => {
  popupVisible.value = false;
  selectedMuscle.value = null;
};
</script>

<template>
  <div v-if="visible && exercise" class="exercise-card">
    <!-- Header with logo and title -->
    <div class="card-header">
      <div class="logo"></div>
      <h1 class="title">{{ exercise.name }}</h1>
    </div>

    <!-- Exercise details section -->
    <div class="details-section">
      <div class="details-grid">
        <div class="detail-item" v-if="exercise.equipmentRequired" title="The equipment required for this exercise.">
          <span class="detail-label" ><strong>Equipment:</strong></span>
          <span class="detail-value">{{ exercise.equipmentRequired }}</span>
        </div>
        <div class="detail-item" v-if="exercise.movementType" title="Whether the exercise is Eccentric, Concentric, Isometric, Dynamic or Special.">
          <span class="detail-label"><strong>Movement:</strong></span>
          <span class="detail-value">{{ exercise.movementType }}</span>
        </div>
        <div class="detail-item" v-if="exercise.isUnilateral !== undefined" title="Whether the exercise will only work one side of the body at a time.">
          <span class="detail-label"><strong>Unilateral:</strong></span>
          <span class="detail-value">{{ exercise.isUnilateral ? 'Yes' : 'No' }}</span>
        </div>
        <div class="detail-item" v-if="exercise.isHighSpinalLoad !== undefined" title="Does the exercise put a lot of weight/stress on the spine?">
          <span class="detail-label"><strong>High Spinal Load:</strong></span>
          <span class="detail-value">{{ exercise.isHighSpinalLoad ? 'Yes' : 'No' }}</span>
        </div>
      </div>
    </div>

    <!-- Statistics section with meters -->
    <div class="stats-section">
      <h2 class="section-title"><strong>Exercise Statistics</strong></h2>
      
      <div class="stat-meters">
        <div class="stat-meter" v-if="exercise.injuryRiskFactor" title="Is the exercise generally considered to be injury prone?">
          <div class="stat-label">Injury Risk:</div>
          <div class="meter-container">
            <div class="meter-segments">
              <div v-for="n in 3" :key="`injury-${n}`" 
                class="meter-segment"
                :class="{ 'segment-filled': n <= injuryRiskSegments }"
              ></div>
            </div>
          </div>
        </div>
        
        <div class="stat-meter" v-if="exercise.jointStressFactor" title="Is the exercise generally considered to be hard on its respective joints?">
          <div class="stat-label">Joint Stress:</div>
          <div class="meter-container">
            <div class="meter-segments">
              <div v-for="n in 3" :key="`joint-${n}`" 
                class="meter-segment"
                :class="{ 'segment-filled': n <= jointStressSegments }"
              ></div>
            </div>
          </div>
        </div>
        
        <div class="stat-meter" v-if="exercise.cnsFatigueFactor" title="Central Nervous System Fatigue. Generally, how hard is the exercise to perform?">
          <div class="stat-label">CNS Fatigue:</div>
          <div class="meter-container">
            <div class="meter-segments">
              <div v-for="n in 3" :key="`cns-${n}`" 
                class="meter-segment"
                :class="{ 'segment-filled': n <= cnsFatigueSegments }"
              ></div>
            </div>
          </div>
        </div>
        
        <div class="stat-meter" v-if="exercise.rangeOfMotion" title="The range of motion of the exercise. How much can the muscle stretch or contract?">
          <div class="stat-label">Range of Motion:</div>
          <div class="stat-value">{{ exercise.rangeOfMotion }}</div>
        </div>
      </div>
    </div>

    <!-- Muscles worked section -->
    <div class="muscles-section" title="LEGEND: Primary = 💥, Synergistic = 🔥, Stabilizing = ✨">
      <h2 class="section-title"><strong>Muscles Worked</strong></h2>

      <div class="muscle-grid">
        <div v-for="muscleInExercise in exercise.muscleInExercises" 
             :key="muscleInExercise.muscleId" 
             class="muscle-item"
             @mouseenter="handleMouseMove(muscleInExercise, $event)"
             @mousemove="handleMouseMove(muscleInExercise, $event)"
             @mouseleave="hidePopup">
          <span class="muscle-icon">{{ getEmoji(muscleInExercise) }}</span>
          <div class="muscle-name-container">
            <span class="muscle-name">{{ MuscleHelper.getMuscleNameById(muscleInExercise.muscleId) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Description section -->
    <div class="description-section">
      <h2 class="section-title"><strong>Description</strong></h2>
      <p class="description-text">
        {{ exercise.description }}
      </p>
    </div>

    <!-- Sets section -->
    <div class="sets-section">
      <h2 class="section-title"><strong>Sets per week</strong></h2>
      <div class="sets-controls">
        <button @click="setsPerWeek > 1 ? setsPerWeek-- : null" class="sets-button sets-button-minus">-</button>
        <span class="sets-value" :key="setsPerWeek">{{ setsPerWeek }}</span>
        <button @click="setsPerWeek++" class="sets-button sets-button-plus">+</button>
      </div>
    </div>

    <!-- Button section -->
    <div class="button-section">
      <button class="back-button" @click="closeExerciseDetail">back</button>
      <button class="select-button" @click="addExerciseToPlan">select >></button>
    </div>
  </div>

  <!-- Muscle Details Popup - Moved outside the exercise card -->
  <Teleport to="body">
    <div v-if="popupVisible" 
         class="muscle-details-popup" 
         :style="{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }">
      <div class="popup-content">
        <div class="popup-details">
          <div class="popup-detail">
            <span class="detail-label">Movement type:</span>
            <span class="detail-value">{{ selectedMuscle?.muscleMovementCategory }}</span>
          </div>
          <div class="popup-detail">
            <span class="detail-label">Contraction:</span>
            <span class="detail-value">{{ selectedMuscle?.contractionType }}</span>
          </div>
          <div class="popup-detail">
            <span class="detail-label">Fatigue:</span>
            <span class="detail-value">{{ selectedMuscle?.fatigueAccumulationFactor }}</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.exercise-card {
  max-width: 600px;
  width: 90%;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow-y: auto;
}

.card-header {
  padding: 10px;
  border-bottom: 1px solid #e1e0e0;
  display: flex;
  align-items: center;
}

.logo {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background-color: #a6e7ff;
  border-radius: 6px;
  margin-right: 12px;
}

.title {
  color: #000000;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.details-section,
.stats-section,
.muscles-section, 
.sets-section {
  padding: 6px 16px;
  border-bottom: 1px solid #e1e0e0;
}

.section-title {
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.detail-label {
  font-weight: 500;
  color: #555;
}

.detail-value {
  color: #000;
}

.stat-meters {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-meter {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.stat-label {
  width: 120px;
  text-align: right;
  padding-right: 10px;
  font-weight: 500;
}

.stat-value {
  font-weight: 400;
}

.meter-container {
  flex: 1;
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
  height: 16px;
  position: relative;
  border-radius: 3px;
  display: flex;
  align-items: center;
  padding: 0 2px;
}

.meter-segments {
  display: flex;
  width: 100%;
  height: 80%;
  gap: 3px;
}

.meter-segment {
  flex: 1;
  background-color: rgba(224, 224, 224, 0.3);
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

.meter-segment.segment-filled:nth-child(3) {
  background-color: #ff3459;
}

.meter-segment.segment-filled:nth-child(2) {
  background-color: #ffa500;
}

.meter-segment.segment-filled:nth-child(1) {
  background-color: #c0ec2e;
}

.muscle-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  max-height: none;
  overflow: hidden;
  padding: 2px;
}

.muscle-item {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.muscle-icon {
  font-size: 16px;
  margin-right: 6px;
  flex-shrink: 0;
}

.muscle-name-container {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.muscle-name {
  color: #000000;
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  display: block;
  transition: transform 0.3s ease;
}

.muscle-name-container:hover .muscle-name {
  text-decoration: underline;
  position: absolute;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2px 4px;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transform: translateX(0);
}

.description-section {
  padding: 6px 16px;
  border-bottom: 1px solid #e1e0e0;
  max-height: 90px;
  overflow-y: auto;
}

.description-text {
  color: #333333;
  font-size: 14px;
  line-height: 1.3;
  margin: 0;
}

.sets-section {
  padding: 6px 16px;
  border-bottom: 1px solid #e1e0e0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 10px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.2);
}

.sets-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px 0;
}

.sets-button {
  width: 36px;
  height: 36px;
  border: 2px solid;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sets-button:hover {
  background-image: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}

.sets-button:active {
  transform: scale(0.7);
  background-image: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1));
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
}

.sets-button-minus {
  background-color: #d42a45;
  color: white;
  border-color: #b82238;
}

.sets-button-plus {
  background-color: #1cba35;
  color: white;
  border-color: #17a02d;
}

.sets-value {
  font-size: 24px;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
  position: relative;
  animation: numberChange 0.3s ease-out;
  background: rgba(255, 255, 255, 0.3);
  padding: 5px 15px;
  border-radius: 6px;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
}

@keyframes numberChange {
  0% {
    opacity: 0;
    filter: blur(5px);
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
  }
}

.button-section {
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

.back-button {
  background-color: transparent;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: color 0.2s, text-shadow 0.2s;
}

.back-button:hover {
  color: #ff3459;
  text-shadow: 0 0 5px rgba(255, 52, 89, 0.3);
}

.select-button {
  background-image: linear-gradient(135deg, #21ee43, #1dd93c);
  color: white;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 9999px;
  border: 2px solid #1dd93c;
  cursor: pointer;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(29, 217, 60, 0.2);
}

.select-button:hover {
  box-shadow: 0 4px 8px rgba(29, 217, 60, 0.4);
}

.muscle-details-popup {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  transition: opacity 0.1s ease-out;
}

.popup-content {
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 4, 0.3);
  min-width: 180px;
}

.popup-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.popup-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.popup-detail .detail-label {
  font-weight: 500;
  color: #555;
}

.popup-detail .detail-value {
  color: #000;
  font-weight: 400;
}
</style>