<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useMuscleStore } from "@/stores/muscle.store";
import { useAllExercisesStore } from "@/stores/exercise.store";
import { useViewModeStore } from "@/stores/viewMode.store";
import { ANIMATION_CONFIG } from '@/config/animations';
import { CONSTANTS } from '@/config/mobile-detector';

// Mobile components
import MobileHeaderSection from "@/components-mobile/HeaderSection.vue";
import MobileFooterSection from "@/components-mobile/FooterSection.vue";
import MobileBodySection from "@/components-mobile/BodySection.vue";
import MobileExerciseSelector from "@/components-mobile/ExerciseSelector.vue";
import MobileWorkoutLog from "@/components-mobile/WorkoutLogTest.vue";
import MobileOptionsMenu from "@/components-mobile/OptionsMenu.vue";
import MobileIntroSequence from "@/components/MobileIntroSequence.vue";

// Desktop components
import DesktopHeaderSection from "@/components/HeaderSection.vue";
import DesktopFooterSection from "@/components/FooterSection.vue";
import DesktopBodySection from "@/components/BodySection.vue";
import DesktopExerciseSelector from "@/components/ExerciseSelector.vue";
import DesktopWorkoutLog from "@/components/WorkoutLogTest.vue";
import DesktopOptionsMenu from "@/components/OptionsMenu.vue";
import DesktopIntroSequence from "@/components/IntroSequence.vue";

const muscleStore = useMuscleStore();
const exerciseStore = useAllExercisesStore();
const viewModeStore = useViewModeStore();
const showIntro = ref(true);
const showMainContent = ref(false);

const showExerciseSelector = computed(() => {
  return !!muscleStore.muscle || exerciseStore.isSearchActive;
});

const isMobile = computed(() => {
  return CONSTANTS.IS_MOBILE;
});

const useMobileView = computed(() => {
  return viewModeStore.getCurrentView();
});

const handleIntroComplete = () => {
  // A small delay to ensure the transition is applied correctly
  setTimeout(() => {
    showMainContent.value = true;
  }, 20); // 20ms delay
  setTimeout(() => {
    showIntro.value = false;
  }, ANIMATION_CONFIG.intro.fadeOut.duration * 1000);
};

const handleViewChoice = (useMobile: boolean) => {
  viewModeStore.setMobileView(useMobile);
  if (useMobile) {
    window.history.pushState({}, '', '/mobile');
  } else {
    window.history.pushState({}, '', '/');
  }
  handleIntroComplete();
};

onMounted(() => {
  const handlePopState = () => {
    viewModeStore.setMobileView(window.location.pathname.endsWith('/mobile'));
  };

  window.addEventListener('popstate', handlePopState);

  if (window.location.pathname.endsWith('/mobile')) {
    viewModeStore.setMobileView(true);
    showIntro.value = false;
    showMainContent.value = true;
  }

  onUnmounted(() => {
    window.removeEventListener('popstate', handlePopState);
  });
});
</script>

<template>
  <div class="app-container">
    <!-- Mobile Intro -->
    <MobileIntroSequence v-if="showIntro && isMobile" @intro-complete="handleViewChoice" />

    <!-- Desktop Intro -->
    <DesktopIntroSequence v-else-if="showIntro && !isMobile" @intro-complete="handleViewChoice" />

    <!-- Mobile Layout -->
    <div v-if="useMobileView === true" class="main-content" :class="{ 'fade-in': showMainContent }">
      <MobileHeaderSection/>
      <MobileBodySection/>
      <MobileFooterSection/>
      <MobileExerciseSelector
        :is-visible="showExerciseSelector"
        :is-search-mode="exerciseStore.isSearchActive"
      />
      <MobileWorkoutLog/>
      <MobileOptionsMenu/>
    </div>

    <!-- Desktop Layout -->
    <div v-else-if="useMobileView === false" class="main-content" :class="{ 'fade-in': showMainContent }">
      <DesktopHeaderSection/>
      <DesktopBodySection/>
      <DesktopFooterSection/>
      <DesktopExerciseSelector
        :is-visible="showExerciseSelector"
        :is-search-mode="exerciseStore.isSearchActive"
      />
      <DesktopWorkoutLog/>
      <DesktopOptionsMenu/>
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
