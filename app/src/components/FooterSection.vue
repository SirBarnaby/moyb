<script setup lang="ts">
import DeepHeaderText from "@/components/DeepHeaderText.vue";
</script>

<template>
  <section class="footersectionabsolute section">
    <DeepHeaderText msg="Not sure what exercise to select? Click here to search!"
                    img_url="/dot.png">
    </DeepHeaderText>
  </section>
</template>

<style scoped>
.footersectionabsolute {
  position: static;
  left: 0%;
  top: auto;
  right: 0%;
  bottom: 0%;
  display: flex;
  width: 100%;
  height: 5vh;
  margin-bottom: 28px;
  justify-content: center;
  align-items: center;
  align-self: center;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}
</style>
