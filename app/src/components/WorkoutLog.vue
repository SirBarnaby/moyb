<script setup lang="ts">
import { useWorkoutPlanStore } from "@/stores/workoutPlan.store";
import { computed } from "vue";

const bllStore = useWorkoutPlanStore();

// Get active muscles with volume
const activeMuscles = computed(() => {
  return bllStore.presetMuscleArray.filter(m => m.getTotalSetVolume() > 0);
});

// Get current exercises
const exercises = computed(() => {
  if (!bllStore.exercisesArray || !bllStore.exercisesArraySets) return [];
  
  return bllStore.exercisesArray.map((exercise, index) => {
    return {
      exercise,
      sets: bllStore.exercisesArraySets[index]
    };
  });
});
</script>

<template>
  <div v-if="exercises.length > 0" class="workoutlog">
    <div class="card">
      <!-- Volume Section -->
      <div class="volume-section">
        <h1 class="volume-title">your volume</h1>

        <div class="metrics">
          <div v-if="activeMuscles.length === 0" class="metric-row">
            <span class="metric-label">No muscles worked yet</span>
          </div>
          
          <div v-for="muscle in activeMuscles" :key="muscle.id" class="metric-row">
            <span class="metric-label">{{ muscle.nameOfMuscle }}:</span>
            <span class="metric-value">{{ muscle.getTotalSetVolume().toFixed(1) }} sets</span>
          </div>
        </div>
      </div>

      <!-- Exercise Section -->
      <div class="exercise-section">
        <div v-for="(item, index) in exercises" :key="index" class="exercise-item">
          <div class="exercise-icon" @click="bllStore.addMuscleLoadToPlan(item.exercise, -item.sets)"></div>
          <div class="exercise-details">
            <h2 class="exercise-title">{{ item.exercise.name }}</h2>
            <span class="exercise-sets">{{ item.sets }} sets</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

.workoutlog {
  position: absolute;
  right: 47px;
  top: 50%;
  transform: translateY(-50%);
  overflow: visible;
  width: 30%;
  min-height: 30%;
  max-height: 80%;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  display: flex;
  flex-direction: column;
}

/* Card styles */
.card {
  font-family: 'Poppins', sans-serif;
  width: 100%;
  max-width: 100%;
  border: 1px solid rgba(225, 224, 224, 0.3);
  border-radius: 0.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
  height: auto;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* Volume section styles */
.volume-section {
  padding: 1.25rem;
  border-bottom: 1px solid #e1e0e0;
  flex-shrink: 0;
}

.volume-title {
  font-size: 2rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0.75rem;
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-row {
  display: flex;
}

.metric-label {
  font-size: 1.125rem;
  font-weight: 700;
  color: #000000;
}

.metric-value {
  font-size: 1.125rem;
  color: #000000;
  margin-left: 0.5rem;
}

/* Exercise section styles */
.exercise-section {
  padding: 1.25rem;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 50vh;
}

.no-exercises {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-style: italic;
}

.exercise-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.7rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid rgba(225, 224, 224, 0.3);
}

.exercise-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.exercise-icon {
  width: 1.8rem;
  height: 1.8rem;
  background-color: #a6e7ff;
  border-radius: 0.375rem;
  margin-right: 0.5rem;
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.exercise-icon:hover {
  background-color: #ff8c8c;
}

.exercise-details {
  flex-grow: 1;
}

.exercise-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000000;
  margin: 0;
  line-height: 1.2;
}

.exercise-sets {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.15rem;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .volume-title {
    font-size: 1.75rem;
  }
  
  .metric-label, .metric-value {
    font-size: 1rem;
  }
  
  .exercise-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 640px) {
  .workoutlog {
    width: 100%;
    right: 0;
    height: auto;
    position: relative;
    margin: 1rem;
    transform: none;
    top: 0;
  }
  
  .volume-title {
    font-size: 1.5rem;
  }
  
  .exercise-title {
    font-size: 1.25rem;
  }
}
</style>
