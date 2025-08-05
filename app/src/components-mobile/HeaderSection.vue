<script setup lang="ts">
import DeepHeaderText from "./DeepHeaderText.vue"
import { ref } from 'vue'
import { DailyTips } from '../bll/EDailyTips.ts'

// Default welcome message
const headerMessage = ref("Welcome to Map-of-Your-Body! Click this text to view your daily tip!")

// Animation class state
const animationClass = ref("")

// Function to get random tip
function getRandomTip() {
  const tips = Object.values(DailyTips)
  const randomIndex = Math.floor(Math.random() * tips.length)
  return tips[randomIndex]
}

// Function to handle click on the header text
function handleHeaderClick() {
  // Start the fade out animation
  animationClass.value = "blurry-fade-out"

  // After the fade out completes, change the text and fade back in
  setTimeout(() => {
    headerMessage.value = getRandomTip()
    animationClass.value = "blurry-fade-in"
  }, 500) // Transition time for fade out
}

// State to track panel visibility
const isPanelVisible = ref(false)

// Emit event when panel visibility changes
const emit = defineEmits(['toggle-panel'])

// Function to toggle panel visibility
function togglePanel() {
  isPanelVisible.value = !isPanelVisible.value
  emit('toggle-panel', isPanelVisible.value)
}
</script>

<template>
  <section class="headersection section">
    <button class="menu-button" @click="togglePanel">☰</button>
    <DeepHeaderText
      :msg="headerMessage"
      img_url="/dot.png"
      @click="handleHeaderClick"
      :animationClass="animationClass"
    >
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

.menu-button {
  position: absolute;
  left: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 100;
}
</style>
