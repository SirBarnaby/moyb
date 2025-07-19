<script setup lang="ts">
import AnatomyViewer from "@/features/anatomy-viewer/AnatomyViewer.vue";
</script>

<template>
  <section class="bodysection section">
    <div class="maincontainer container">
      <AnatomyViewer />
    </div>
  </section>
</template>

<style scoped>
.bodysection {
  position: static;
  display: flex;
  height: 85vh;
  min-height: 85vh;
  justify-content: center;
  align-items: center;
}

.maincontainer {
  display: flex;
  flex-direction: column; /* Ensures elements stack vertically */
  justify-content: center; /* Centers vertically */
  align-items: center; /* Centers horizontally */
  height: 100%;
  width: 75%;
}
</style>
