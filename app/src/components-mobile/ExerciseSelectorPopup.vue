<script setup lang="ts">
import { computed } from "vue";
import { useMuscleStore } from "@/stores/muscle.store";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  isVisible: boolean;
}>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(['exercise-selected']);

const muscleStore = useMuscleStore();
const targetMuscle = computed(() => muscleStore.muscle);

// Helper function to get meter segments based on value
const getMeterSegments = (value: string) => {
  switch(value) {
    case '1': return 1; // One segment for low values
    case '2': return 2; // Two segments for medium values
    case '3': return 3; // Three segments for high values
    default: return 0; // No segments for invalid values
  }
};

// For the endurance meter using the enduranceRatingFactor
const enduranceSegments = computed(() => {
  if (!targetMuscle.value || !targetMuscle.value.enduranceRatingFactor) {
    return 0;
  }
  return getMeterSegments(targetMuscle.value.enduranceRatingFactor);
});

// For the recovery time
const recoverySegments = computed(() => {
  if (!targetMuscle.value || !targetMuscle.value.recoveryTimeFactor) {
    return 0;
  }
  return getMeterSegments(targetMuscle.value.recoveryTimeFactor);
});

// For the eccentric strength
const eccentricStrengthSegments = computed(() => {
  if (!targetMuscle.value || !targetMuscle.value.eccentricStrengthFactor) {
    return 0;
  }
  return getMeterSegments(targetMuscle.value.eccentricStrengthFactor);
});

// For neural drive sensitivity
const neuralDriveSegments = computed(() => {
  if (!targetMuscle.value || !targetMuscle.value.neuralDriveSensitivityFactor) {
    return 0;
  }
  return getMeterSegments(targetMuscle.value.neuralDriveSensitivityFactor);
});

// For motor unit recruitment speed
const motorUnitSegments = computed(() => {
  if (!targetMuscle.value || !targetMuscle.value.motorUnitRecruitmentSpeedFactor) {
    return 0;
  }
  return getMeterSegments(targetMuscle.value.motorUnitRecruitmentSpeedFactor);
});

// For stretch sensitivity
const stretchSensitivitySegments = computed(() => {
  if (!targetMuscle.value || !targetMuscle.value.stretchSensitivityFactor) {
    return 0;
  }
  return getMeterSegments(targetMuscle.value.stretchSensitivityFactor);
});

// Helper to get the appropriate fiber type image
const fiberTypeImage = computed(() => {
  if (!targetMuscle.value || !targetMuscle.value.dominantFiberType) {
    return "/musclefiber1.png";
  }

  // Return different images based on fiber type
  switch(targetMuscle.value.dominantFiberType.toLowerCase()) {
    case 'i':
      return "/musclefiber1.png";
    case 'ii':
      return "/musclefiber2.png";
    default: // mixed
      return "/musclefiber-X.png";
  }
});
</script>

<template>
  <div
    class="exerciseselectorpopup"
    :class="{ 'popup-visible': isVisible }"
  >
    <div class="indepthstatistics">
      <div class="singlestatistic wf-grid" v-if="targetMuscle" title="High muscle endurance means good capability for sustained effort--high-rep work might be more beneficial. Vice-versa for low endurance muscles.">
        <div class="statistictext">Endurance:</div>
        <div class="statisticmeter">
          <div class="meter-segments">
            <div v-for="n in 3" :key="n"
              class="meter-segment"
              :class="{ 'segment-filled': n <= enduranceSegments }"
            ></div>
          </div>
        </div>
      </div>
      <div class="singlestatistic wf-grid" v-if="targetMuscle" title="Short recovery time means a possibility to train the muscle with higher frequency. Long recovery muscles might have an injury risk if overworked.">
        <div class="statistictext">Recovery speed:</div>
        <div class="statisticmeter">
          <div class="meter-segments">
            <div v-for="n in 3" :key="n"
              class="meter-segment"
              :class="{ 'segment-filled': n <= recoverySegments }"
            ></div>
          </div>
        </div>
      </div>
      <div class="singlestatistic wf-grid" v-if="targetMuscle" title="High eccentric strength tolerates heavy lowering better, low eccentric strength can risk DOMS/injury during negatives.">
        <div class="statistictext">Eccentric strength:</div>
        <div class="statisticmeter">
          <div class="meter-segments">
            <div v-for="n in 3" :key="n"
              class="meter-segment"
              :class="{ 'segment-filled': n <= eccentricStrengthSegments }"
            ></div>
          </div>
        </div>
      </div>
      <div class="singlestatistic wf-grid" v-if="targetMuscle" title="High neural drive sensitivity means the muscle is subject to more explosive power, which means you can utilize max-effort lifts better.">
        <div class="statistictext">Neural drive sensitivity:</div>
        <div class="statisticmeter">
          <div class="meter-segments">
            <div v-for="n in 3" :key="n"
              class="meter-segment"
              :class="{ 'segment-filled': n <= neuralDriveSegments }"
            ></div>
          </div>
        </div>
      </div>
      <div class="singlestatistic wf-grid" v-if="targetMuscle" title="Fast motor unit recruitment speed is good for power training like jumps and throws, slow recruitment speed benefits from Time-under-tension methods.">
        <div class="statistictext">Motor unit recruitment speed:</div>
        <div class="statisticmeter">
          <div class="meter-segments">
            <div v-for="n in 3" :key="n"
              class="meter-segment"
              :class="{ 'segment-filled': n <= motorUnitSegments }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="popupright">
      <div class="popuprightdown" title="Type I, II or a mix of both. Type I fibers are more resistant to fatigue, able to go for high reps. Vice-versa for Type II fibers.">
        <div class="popuprightdowntext">Main fiber type:</div>
        <div class="describingtextimage" :style="{ backgroundImage: `url(${fiberTypeImage})` }"></div>
      </div>
      <div class="muscle-features" v-if="targetMuscle" title="High stretch sensitivity muscles respond well to deep stretches, like lunges. Low sensitivity is prone to injury with extreme ROM.">
        <div class="feature-item" v-if="targetMuscle.stretchSensitivityFactor">
          <div class="feature-label">Stretch Sensitivity:</div>
          <div class="statisticmeter stretch-sensitivity-meter">
            <div class="meter-segments">
              <div v-for="n in 3" :key="n"
                class="meter-segment stretch-sensitivity"
                :class="{ 'segment-filled': n <= stretchSensitivitySegments }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exerciseselectorpopup {
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  grid-template-rows: auto;
  grid-template-columns: 60% 40%;
  grid-auto-columns: 1fr;
  height: 100%; /* Fill the container */
  font-size: 100%;
  display: flex;
  overflow: hidden; /* Prevent content from spilling out */
  box-shadow: 0 2px 14px 4px #00000000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  background-color: transparent;
  backdrop-filter: blur(4px);
  z-index: 1; /* Ensure it's stacked correctly */
  opacity: 0;
  pointer-events: none;
}

.popup-visible {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
  line-height: 1;
}

/* Statistics section styling */
.indepthstatistics {
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  grid-template-rows: 20% 20% 20% 20% 20%;
  grid-template-columns: .25fr 1fr;
  grid-auto-columns: 1fr;
  width: 65%;
  height: 100%;
  padding-right: 2%;
  display: block;
}

.singlestatistic {
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  grid-template-rows: auto;
  grid-template-columns: 163px 1fr;
  grid-auto-columns: 1fr;
  place-items: center;
  height: 20%;
  display: grid;
}

.statistictext {
  direction: ltr;
  text-align: right;
  text-transform: none;
  white-space: normal;
  font-family: Inter, sans-serif;
  font-style: italic;
  font-weight: 500;
  padding-right: 10px;
  width: 100%;
  font-size: 90%;
  line-height: 0.9;
}

.statisticmeter {
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
  width: 100%;
  height: 85%;
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  display: flex;
  align-items: center;
  padding: 0 2px;
}

.meter-segments {
  display: flex;
  width: 100%;
  height: 80%;
  gap: 4px;
}

.meter-segment {
  flex: 1;
  background-color: rgba(224, 224, 224, 0.3);
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

.meter-segment.segment-filled {
  background-color: #c0ec2e;
}

.meter-segment.segment-filled:nth-child(1) {
  background-color: #ff3459;
}

.meter-segment.segment-filled:nth-child(2) {
  background-color: #ffa500;
}

.meter-segment.segment-filled:nth-child(3) {
  background-color: #c0ec2e;
}

.meter-segment.stretch-sensitivity.segment-filled {
  background-color: rgb(255, 255, 255);
}

.popupright {
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 35%;
  height: 100%;
  max-height: 100%;
  display: flex;
}

.popuprightdown {
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 35%;
  display: flex;
}

.describingtextimage {
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: contain;
  width: 50%;
  height: 100%;
}

.popuprightdowntext {
  font-family: Inter, sans-serif;
  font-size: 120%;
  font-weight: 700;
}

.muscle-features {
  padding: 10px;
  width: 100%;
}

.feature-item {
  margin-bottom: 5px;
  font-family: Inter, sans-serif;
  font-size: 90%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.feature-label {
  font-weight: bold;
  margin-right: 5px;
  font-style: italic;
  width: 100%;
}

.stretch-sensitivity-meter {
  width: 94%;
  height: 20px;
  margin-top: 5px;
}
</style>
