<!-- AI-PRIMER: ExerciseSelector.vue
  Purpose: Presents UI controls for choosing an Exercise either by currently selected muscle **or** via free-text search.
  Invariants: Relies exclusively on Pinia `useAllExercisesStore` for state. No direct DOM queries or global mutations. -->
<script setup lang="ts">
import ExerciseSelectorMain from "@/components-mobile/ExerciseSelectorMain.vue";

const props = defineProps<{
  isVisible: boolean;
  isSearchMode: boolean;
}>();
</script>

<template>
  <div v-show="props.isVisible">
    <ExerciseSelectorMain/>
  </div>
</template>

<style scoped>

</style>
