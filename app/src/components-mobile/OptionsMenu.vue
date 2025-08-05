<script setup lang="ts">
import { ref } from 'vue';
import { useWorkoutPlanStore } from "@/stores/workoutPlan.store.ts";

const bllStore = useWorkoutPlanStore();
const isOpen = ref(false);

// Default values
const setsPerWeekMax = ref(bllStore.setsPerWeekMax);
const synergisticMultiplier = ref(bllStore.synergisticMultiplier);
const stabilizingMultiplier = ref(bllStore.stabilizingMultiplier);

// Function to update values immediately
const updateValue = (type: 'sets' | 'synergistic' | 'stabilizing', value: number) => {
  if (type === 'sets') {
    setsPerWeekMax.value = value;
    bllStore.updateMultipliers({
      setsPerWeekMax: value,
      synergisticMultiplier: synergisticMultiplier.value,
      stabilizingMultiplier: stabilizingMultiplier.value
    });
  } else if (type === 'synergistic') {
    synergisticMultiplier.value = value;
    bllStore.updateMultipliers({
      setsPerWeekMax: setsPerWeekMax.value,
      synergisticMultiplier: value,
      stabilizingMultiplier: stabilizingMultiplier.value
    });
  } else if (type === 'stabilizing') {
    stabilizingMultiplier.value = value;
    bllStore.updateMultipliers({
      setsPerWeekMax: setsPerWeekMax.value,
      synergisticMultiplier: synergisticMultiplier.value,
      stabilizingMultiplier: value
    });
  }
};

// Function to toggle menu visibility
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="options-menu" :class="{ 'options-menu-open': isOpen }">
    <div class="options-header">
      <div class="options-logo"></div>
      <h1 class="options-title">Options</h1>
      <button class="close-button" @click="toggleMenu">×</button>
    </div>

    <div class="options-section">
      <h2 class="section-title"><strong>Volume Settings</strong></h2>

      <div class="option-item">
        <div class="option-label">Max Sets per Week:</div>
        <div class="option-description">We recommend not to change it, but you can. You reach 40% of the maximum muscle stimulus, roughly, at around ~10 sets per week. 80% at around ~20. This is why 20 is the default.</div>
        <div class="option-controls">
          <button @click="updateValue('sets', Math.max(1, setsPerWeekMax - 1))" class="option-button option-button-minus">-</button>
          <span class="option-value">{{ setsPerWeekMax }}</span>
          <button @click="updateValue('sets', setsPerWeekMax + 1)" class="option-button option-button-plus">+</button>
        </div>
      </div>

      <div class="option-item">
        <div class="option-label">Synergistic Multiplier:</div>
        <div class="option-description">Synergic muscles movements are not as exhausting to the muscle as primary movements. This is why the default multiplier is half. You can fine-tune it if you wish.</div>
        <div class="option-controls">
          <button @click="updateValue('synergistic', Number((Math.max(0.1, synergisticMultiplier - 0.1)).toFixed(2)))" class="option-button option-button-minus">-</button>
          <span class="option-value">{{ synergisticMultiplier }}</span>
          <button @click="updateValue('synergistic', Number((Math.min(1, synergisticMultiplier + 0.1)).toFixed(2)))" class="option-button option-button-plus">+</button>
        </div>
      </div>

      <div class="option-item">
        <div class="option-label">Stabilizing Multiplier:</div>
        <div class="option-description">Stabilizing muscles movements are the ones that keep your body stable during movement. They are mostly isometric, and not as exhausting, this is why their default contribution is one third.</div>
        <div class="option-controls">
          <button @click="updateValue('stabilizing', Number((Math.max(0.1, stabilizingMultiplier - 0.1)).toFixed(2)))" class="option-button option-button-minus">-</button>
          <span class="option-value">{{ stabilizingMultiplier }}</span>
          <button @click="updateValue('stabilizing', Number((Math.min(1, stabilizingMultiplier + 0.1)).toFixed(2)))" class="option-button option-button-plus">+</button>
        </div>
      </div>
    </div>
  </div>

  <button class="options-toggle-button" @click="toggleMenu">
    <span class="options-toggle-icon">⚙️</span>
  </button>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.options-menu {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  z-index: 1000;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.options-menu-open {
  transform: translateY(0);
  opacity: 1;
}

.options-header {
  padding: 10px;
  border-bottom: 1px solid #e1e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0 8px;
  transition: color 0.2s;
}

.close-button:hover {
  color: #333;
}

.options-logo {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background-color: #a6e7ff;
  border-radius: 6px;
  margin-right: 12px;
}

.options-title {
  color: #000000;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.options-section {
  padding: 16px;
  border-bottom: 1px solid #e1e0e0;
}

.section-title {
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 16px 0;
}

.option-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.option-label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
}

.option-description {
  font-size: 12px;
  color: #000000;
  margin-bottom: 8px;
  line-height: 1.4;
}

.option-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.option-button {
  width: 32px;
  height: 32px;
  border: 2px solid;
  border-radius: 50%;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.option-button:hover {
  background-image: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}

.option-button:active {
  transform: scale(0.7);
  background-image: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1));
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
}

.option-button-minus {
  background-color: #d42a45;
  color: white;
  border-color: #b82238;
}

.option-button-plus {
  background-color: #1cba35;
  color: white;
  border-color: #17a02d;
}

.option-value {
  font-size: 18px;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
  background: rgba(255, 255, 255, 0.3);
  padding: 5px 15px;
  border-radius: 6px;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
}

.options-toggle-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 999;
  transition: transform 0.2s;
}

.options-toggle-button:hover {
  transform: scale(1.1);
}

.options-toggle-icon {
  font-size: 24px;
}
</style>
