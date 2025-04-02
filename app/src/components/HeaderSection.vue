<script setup lang="ts">
import DeepHeaderText from "./DeepHeaderText.vue"
</script>

<template>
  <section class="headersection section">
    <DeepHeaderText msg="Welcome to Map-of-Your-Body! Click this text to view your daily tip!"
                    img_url="/dot.png">

    </DeepHeaderText>
  </section>
</template>

<style scoped>
.headersection {
  display: flex;
  width: 100%;
  height: 5vh;
  margin-top: 17px;
  justify-content: center;
  align-items: center;
  align-self: center;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}
</style>
