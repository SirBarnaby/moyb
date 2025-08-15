<script setup lang="ts">
import { computed } from 'vue'
import { useMuscleStore } from '@/stores/muscle.store'

// If you already have a Progress.vue, replace the local component below with:
// import Progress from '@/components/ui/progress/Progress.vue'


interface Props {
  isMetricsVisible?: boolean;
}

const props = defineProps<Props>()

const muscleStore = useMuscleStore()
const targetMuscle = computed(() => muscleStore.muscle)

// Helper function to get meter segments based on value
const getMeterSegments = (value: string) => {
  switch(value) {
    case '1': return 1; // One segment for low values
    case '2': return 2; // Two segments for medium values
    case '3': return 3; // Three segments for high values
    default: return 0; // No segments for invalid values
  }
};

// Computed metrics based on muscle data
const metrics = computed(() => [
  {
    name: 'Endurance',
    value: targetMuscle.value?.enduranceRatingFactor ? getMeterSegments(targetMuscle.value.enduranceRatingFactor) : 0
  },
  {
    name: 'Recovery speed',
    value: targetMuscle.value?.recoveryTimeFactor ? getMeterSegments(targetMuscle.value.recoveryTimeFactor) : 0
  },
  {
    name: 'Eccentric strength',
    value: targetMuscle.value?.eccentricStrengthFactor ? getMeterSegments(targetMuscle.value.eccentricStrengthFactor) : 0
  },
  {
    name: 'Neural drive sensitivity',
    value: targetMuscle.value?.neuralDriveSensitivityFactor ? getMeterSegments(targetMuscle.value.neuralDriveSensitivityFactor) : 0
  },
  {
    name: 'Motor unit recr. speed',
    value: targetMuscle.value?.motorUnitRecruitmentSpeedFactor ? getMeterSegments(targetMuscle.value.motorUnitRecruitmentSpeedFactor) : 0
  },
]);

const stretchSensitivity = computed(() => {
  if (!targetMuscle.value || !targetMuscle.value.stretchSensitivityFactor) {
    return 0
  }
  return getMeterSegments(targetMuscle.value.stretchSensitivityFactor)
})

// Helper to get the appropriate fiber type image
const fiberTypeImage = computed(() => {
  if (!targetMuscle.value || !targetMuscle.value.dominantFiberType) {
    return "/musclefiber1.png"
  }

  // Return different images based on fiber type
  switch(targetMuscle.value.dominantFiberType.toLowerCase()) {
    case 'i':
      return "/musclefiber1.png"
    case 'ii':
      return "/musclefiber2.png"
    default: // mixed
      return "/musclefiber-X.png"
  }
})

</script>

<template>
  <div
    class="fitness-metrics-card"
    :class="{
      'fitness-metrics-visible': props.isMetricsVisible,
      'fitness-metrics-hidden': !props.isMetricsVisible
    }"
  >
    <!-- Header -->
    <div
      class="card-header flex items-center justify-between metallic-sheen"
    >
      <div>
        <h1 class="text-2xl font-bold text-black tracking-tight">
          Performance Metrics
        </h1>
      </div>
    </div>

    <!-- Content -->
    <div class="fitness-metrics-content flex-1 p-2 space-y-2 overflow-y-auto">
      <!-- Metrics Section -->
      <div class="space-y-1">
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="(metric, index) in metrics"
            :key="index"
            class="backdrop-blur-sm rounded-md single-statistic-container"
          >
            <div class="space-y-1">
              <h3 class="text-xs font-medium text-black-700">{{ metric.name }}</h3>
              <div class="relative h-[15px] bg-gray-200 rounded-[3px] overflow-hidden single-statistic">
                <div class="absolute inset-0 flex">
                  <div v-for="n in 3" :key="n"
                    class="meter-segment"
                    :class="{ 'segment-filled': n <= metric.value }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stretch sensitivity bar in the last row -->
          <div class="backdrop-blur-sm rounded-md single-statistic-container">
            <div class="space-y-1">
              <h3 class="text-xs font-medium text-black-700">Stretch sensitivity</h3>
              <div class="relative h-[15px] bg-gray-200 rounded-[3px] overflow-hidden single-statistic">
                <div class="absolute inset-0 flex">
                  <div v-for="n in 3" :key="n"
                    class="meter-segment stretch-sensitivity"
                    :class="{ 'segment-filled': n <= stretchSensitivity }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Muscle info section -->
      <div class="space-y-1">
        <div class="space-y-2 pt-2">
          <div class="backdrop-blur-sm rounded-md single-statistic-container">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 flex flex-col items-center">
                <h3 class="text-xs font-medium text-black-700 mb-1">Main fiber type:</h3>
                <img
                  :src="fiberTypeImage"
                  width="60"
                  height="60"
                  alt="Muscle fiber type"
                  class="max-w-full max-h-full object-contain"
                />
              </div>
              <div class="flex-1">
                <p class="text-xs text-black-600 leading-relaxed">
                  {{ targetMuscle?.description || 'No description available for this muscle.' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

/* The main card */
.fitness-metrics-card {
  font-family: 'Poppins', sans-serif;
  left: 2.5vw;
  bottom: 3.9vh;
  position: fixed;
  width: 30%;
  min-width: 95vw;
  min-height: 50vh;
  max-height: 50vh;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(24px);
  box-shadow: 17px 17px 20px 10px rgba(0, 0, 0, 0.4);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Content container for fade in/out effect */
.fitness-metrics-content {
  opacity: 0;
  transition: opacity 0.25s ease-in-out;
}

.fitness-metrics-visible .fitness-metrics-content {
  opacity: 1;
}

.single-statistic {
  text-shadow: 0px 0px 3px 4px rgba(255, 255, 255, 1);
}

.single-statistic-container {
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(12px) contrast(1.25);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.muscle-info {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.stretch-sensitivity {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.fitness-metrics-visible {
  bottom: 41vh;
}

/* Added for the fiber type positioning */
.flex-shrink-0 {
  flex-shrink: 0;
}

/* Adjustments for the new layout */
.muscle-info {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.text-2xl {
  font-size: 1.3rem;
}

.text-sm {
  line-height: 1.25rem;
  font-size: 1.1rem;
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

/* Divider styling */
.metrics-divider,
.sensitivity-divider,
.fiber-type-divider {
  display: flex;
  align-items: center;
  width: 100%;
}

.metrics-divider::before,
.metrics-divider::after,
.sensitivity-divider::before,
.sensitivity-divider::after,
.fiber-type-divider::before,
.fiber-type-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.2);
}

.metrics-divider h2,
.sensitivity-divider h2,
.fiber-type-divider h2 {
  padding: 0 10px;
  margin: 0;
  white-space: nowrap;
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

/* Firefox scrollbar styling */
@supports (scrollbar-color: auto) {
  .scroll-container {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1);
  }
}

.meter-segment {
  flex: 1;
  transition: background-color 0.3s ease;
}

.meter-segment.segment-filled {
  background-color: #c0ec2e;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.15);
  border-radius: 0px;
}

.meter-segment.segment-filled:nth-child(1) {
  background-color: #f03859;
}

.meter-segment.segment-filled:nth-child(2) {
  background-color: #ffa03a;
}

.meter-segment.segment-filled:nth-child(3) {
  background-color: #c1fb00;
}

.meter-segment.stretch-sensitivity.segment-filled {
  background-color: #bebebe;
}

/* Metallic Sheen Animation */
.metallic-sheen {
  position: relative;
  cursor: pointer;
  background: linear-gradient(
    135deg,
    #000000 0%,
    #363636 25%,
    #2c2c2c 66%,
    #b1af9c 75%,
    #000000 90%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: metallicShine 3s ease-in-out infinite;
  transition: all 0.3s ease;
}

@keyframes metallicShine {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.metallic-sheen:active {
  transform: scale(0.98);
}

@media (hover: none) {
  .metallic-sheen:active {
    transform: scale(0.95);
  }
}
</style>
