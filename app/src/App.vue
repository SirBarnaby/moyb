<script setup lang="ts">
import HeaderSection from "@/components/HeaderSection.vue";
import FooterSection from "@/components/FooterSection.vue";
import BodySection from "@/components/BodySection.vue";
import ExerciseSelector from "@/components/ExerciseSelector.vue";
import WorkoutLog from "@/components/WorkoutLog.vue";
import OptionsMenu from "@/components/OptionsMenu.vue";
import IntroSequence from "@/components/IntroSequence.vue";
import { ref, watch } from "vue";
import { useMuscleStore } from "@/dal/Muscle.ts";
import { ANIMATION_CONFIG } from '@/config/animations';

const muscleStore = useMuscleStore();
const isMuscleSelected = ref(false);
const showIntro = ref(true);
const showMainContent = ref(false);

// Watch for changes in the selected muscle
watch(
  () => muscleStore.muscle,
  (newMuscle) => {
    isMuscleSelected.value = !!newMuscle;
  },
  { immediate: true }
);

const handleIntroComplete = () => {
  showMainContent.value = true;
  setTimeout(() => {
    showIntro.value = false;
  }, ANIMATION_CONFIG.intro.fadeOut.duration * 1000);
};
</script>

<template>
  <div class="app-container">
    <IntroSequence v-if="showIntro" @intro-complete="handleIntroComplete" />
    <div class="main-content" :class="{ 'fade-in': showMainContent }">
      <HeaderSection/>
      <BodySection/>
      <FooterSection/>
      <ExerciseSelector :is-muscle-selected="isMuscleSelected" />
      <WorkoutLog/>
      <OptionsMenu/>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.main-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity v-bind('ANIMATION_CONFIG.mainContent.fadeIn.duration + "s"') v-bind('ANIMATION_CONFIG.mainContent.fadeIn.timing');
  pointer-events: none;
}

.main-content.fade-in {
  opacity: 1;
  pointer-events: auto;
}
</style>
