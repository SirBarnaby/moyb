<script setup lang="ts">
/**
 * @fileoverview AI-Primer: A purely presentational component that renders the human anatomy SVG.
 * It receives reactive class information via props and emits an event when a muscle is clicked.
 * It contains no business logic.
 */

import type { PropType } from 'vue';
import { useExerciseSelectorStore } from '@/stores/exerciseSelector.store';

defineProps({
  /**
   * An object where keys are muscle element IDs and values are objects
   * containing boolean class flags (e.g., { selected: true }).
   */
  muscleClasses: {
    type: Object as PropType<Record<string, object>>,
    required: true,
  },
  muscleStyles: {
    type: Object as PropType<Record<string, { fill: string }>>,
    required: true,
  }
});

const emit = defineEmits<{
  (e: 'muscleClick', muscleName: string): void;
}>();

const exerciseSelectorStore = useExerciseSelectorStore();
</script>

<template>
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 203 203"
    version="1.1"
    id="svg1"
    xml:space="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg"
    class="anatomy"
    :class="{ 'up': exerciseSelectorStore.isExerciseSelectorOpen }"
    >
    <defs id="defs1" />
    <g id="layer1" transform="translate(-620.07498)" />

    <!-- Base body outline -->
    <path
      fill="#353535"
      opacity="1"
      stroke="none"
      d="M 25,10 h 155 v 190 h -155 z"
      id="base_body_simplified" />

    <!-- Chest -->
    <g
      id="chest"
      :style="muscleStyles.chest"
      @click="emit('muscleClick', 'chest')"
      :class="muscleClasses.chest">
      <title>Pectoralis Major and Minor</title>
      <path fill="#979797" d="M 37,35 h 20 v 23 h -20 z M 58,35 h 22 v 23 h -22 z" />
    </g>

    <!-- Tibialis Anterior -->
    <g
      id="tibialis"
      @click="emit('muscleClick', 'tibialis')"
      :class="muscleClasses.tibialis">
      <title>Tibialis Anterior</title>
      <path fill="#9c9c9c" d="M 43,153 h 5 v 27 h -5 z M 64,158 h 9 v 22 h -9 z" />
    </g>

    <!-- Biceps -->
    <g
      id="biceps"
      @click="emit('muscleClick', 'biceps')"
      :class="muscleClasses.biceps">
      <title>Biceps Brachii</title>
      <path fill="#9c9c9c" d="M 30,49 h 6 v 17 h -6 z M 77,46 h 7 v 19 h -7 z" />
    </g>

    <!-- Front Delts -->
    <g
      id="frontdelts"
      @click="emit('muscleClick', 'anterior delts')"
      :class="muscleClasses.frontdelts">
      <title>Deltoideus (Anterior)</title>
      <path fill="#959595" d="M 30,33 h 16 v 14 h -16 z M 67,34 h 14 v 13 h -14 z" />
    </g>

    <!-- Abductors -->
    <g
      id="abductors"
      @click="emit('muscleClick', 'abductors')"
      :class="muscleClasses.abductors">
      <title>Gluteus Medius/Minimus</title>
      <path fill="#9a9a9a" d="M 38,83 h 4 v 19 h -4 z M 72,83 h 4 v 17 h -4 z" />
    </g>

    <!-- Abs -->
    <g
      id="abs"
      @click="emit('muscleClick', 'abs')"
      :class="muscleClasses.abs">
      <title>Rectus Abdominis</title>
      <path fill="#9c9c9c" d="M 47,54 h 22 v 45 h -22 z" />
    </g>

    <!-- Glutes -->
    <g
      id="glutes"
      @click="emit('muscleClick', 'glutes')"
      :class="muscleClasses.glutes">
      <title>Gluteus Maximus</title>
      <path fill="#9d9d9d" d="M 128,80 h 16 v 25 h -16 z M 149,80 h 16 v 23 h -16 z" />
    </g>

    <!-- Trapezius -->
    <g
      id="traps"
      @click="emit('muscleClick', 'trapezius')"
      :class="muscleClasses.trapezius">
      <title>Trapezius</title>
      <path fill="#9a9a9a" d="M 44,26 h 8 v 7 h -8 z M 65,27 h 7 v 7 h -7 z M 137,25 h 17 v 35 h -17 z" />
    </g>

    <!-- Lats -->
    <g
      id="lats"
      @click="emit('muscleClick', 'lats')"
      :class="muscleClasses.lats">
      <title>Latissimus Dorsi</title>
      <path fill="#9d9d9d" d="M 130,64 h 14 v 22 h -14 z M 149,64 h 14 v 22 h -14 z" />
    </g>

    <!-- Triceps -->
    <g
      id="triceps"
      @click="emit('muscleClick', 'triceps')"
      :class="muscleClasses.triceps">
      <title>Triceps Brachii</title>
      <path fill="#919191" d="M 29,48 h 5 v 15 h -5 z M 83,48 h 3 v 15 h -3 z M 120,54 h 6 v 15 h -6 z M 172,41 h 2 v 22 h -2 z" />
    </g>

    <!-- Adductors -->
    <g
      id="adductors"
      @click="emit('muscleClick', 'adductors')"
      :class="muscleClasses.adductors">
      <title>Adductor Group</title>
      <path fill="#9a9a9a" d="M 49,93 h 18 v 29 h -18 z M 136,104 h 18 v 25 h -18 z" />
    </g>

    <!-- Forearm Extensors -->
    <g
      id="forearmextendors"
      @click="emit('muscleClick', 'forearm extensors')"
      :class="muscleClasses.forearmextendors">
      <title>Extensor Group</title>
      <path fill="#9b9b9b" d="M 110,72 h 10 v 19 h -10 z M 173,68 h 9 v 21 h -9 z" />
    </g>

    <!-- Rotator Cuff -->
    <g
      id="rotatorcuff"
      @click="emit('muscleClick', 'rotator cuff')"
      :class="muscleClasses.rotatorcuff">
      <title>Rotator Cuff</title>
      <path fill="#9c9c9c" d="M 127,39 h 9 v 12 h -9 z M 156,42 h 11 v 10 h -11 z" />
    </g>

    <!-- Calves -->
    <g
      id="calves"
      @click="emit('muscleClick', 'calves')"
      :class="muscleClasses.calves">
      <title>Gastrocnemius and Soleus</title>
      <path fill="#9a9a9a" d="M 50,153 h 14 v 12 h -14 z M 130,142 h 33 v 39 h -33 z" />
    </g>

    <!-- Rear Delts -->
    <g
      id="reardelts"
      @click="emit('muscleClick', 'posterior delts')"
      :class="muscleClasses.reardelts">
      <title>Deltoideus (Posterior)</title>
      <path fill="#9a9a9a" d="M 119,37 h 11 v 11 h -11 z M 165,37 h 9 v 11 h -9 z" />
    </g>

    <!-- Lower Back -->
    <g
      id="lowerback"
      @click="emit('muscleClick', 'lower back')"
      :class="muscleClasses.lowerback">
      <title>Erector Spinae</title>
      <path fill="#9a9a9a" d="M 140,67 h 12 v 18 h -12 z" />
    </g>

    <!-- Quads -->
    <g
      id="quads"
      @click="emit('muscleClick', 'quads')"
      :class="muscleClasses.quads">
      <title>Quadriceps Femoris</title>
      <path fill="#9d9d9d" d="M 38,90 h 36 v 50 h -36 z M 126,104 h 41 v 18 h -41 z" />
    </g>

    <!-- Obliques -->
    <g
      id="obliques"
      @click="emit('muscleClick', 'obliques')"
      :class="muscleClasses.obliques">
      <title>External/Internal Obliques</title>
      <path fill="#9b9b9b" d="M 40,59 h 34 v 31 h -34 z M 135,73 h 26 v 8 h -26 z" />
    </g>

    <!-- Hamstrings -->
    <g
      id="hamstrings"
      @click="emit('muscleClick', 'hamstrings')"
      :class="muscleClasses.hamstrings">
      <title>Biceps Femoris</title>
      <path fill="#9b9b9b" d="M 129,98 h 32 v 42 h -32 z" />
    </g>

    <!-- Forearm Flexors -->
    <g
      id="forearmflexors"
      @click="emit('muscleClick', 'forearm flexors')"
      :class="muscleClasses.forearmflexors">
      <title>Flexor Group</title>
      <path fill="#9b9b9b" d="M 23,64 h 12 v 26 h -12 z M 85,65 h 8 v 25 h -8 z M 115,66 h 9 v 22 h -9 z M 169,71 h 9 v 18 h -9 z" />
    </g>

    <!-- Side Delts -->
    <g
      id="sidedelts"
      @click="emit('muscleClick', 'lateral delts')"
      :class="muscleClasses.sidedelts">
      <title>Deltoideus (Lateral)</title>
      <path fill="#919191" d="M 28,35 h 8 v 11 h -8 z M 78,34 h 5 v 11 h -5 z M 122,32 h 6 v 13 h -6 z M 165,32 h 9 v 11 h -9 z" />
    </g>
  </svg>

</template>

<style scoped>
/* Selected class provides the temporary highlight effect */
.selected {
  /* Using a filter for flexible colorization, can be anything */
  filter: drop-shadow(0 0 8px rgba(74, 144, 226, 0.9));
  transition: filter 0.3s ease-in-out;
}

.anatomy {
  position: fixed;
  top: 0vh;
  transition: top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.anatomy.up {
  top: -27vh;
}

</style>
