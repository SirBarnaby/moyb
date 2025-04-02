<script setup lang="ts">
import { useExerciseStore } from "@/dal/Exercise.ts";
import { computed } from "vue";

const store = useExerciseStore();
const exercises = computed(() => store.exercises);
</script>

<template>
  <div class="exerciseselectormain">
    <div class="exerciseselectortop">
      <div class="hoverablearrow">&lt;arrow&gt;</div>
      <div class="exerciseselectortopdivider">
        <div class="exerciseselectortopleft">
          <div class="describingtext">Your pecs aren’t just for show—they're the powerhouse behind every strong push, whether you're shoving an opponent in sports, launching yourself off the ground in a burpee, or holding your balance when falling forward.</div>
        </div>
        <div class="exerciseselectortopright">
          <div class="esmusclegroup">SIDE DELTS</div>
          <div class="esmusclegrouplatin">Pectoralis Major</div>
        </div>
      </div>
    </div>
    <div class="exerciseselectorall">
      <div v-for="exercise in exercises" :key="exercise" class="exerciseselectoritem">
        <div class="exerciseselectoritemleft">
          <div class="esilleft">
            <div class="exercisedescription">{{ exercise.description }}</div>
          </div>
          <div class="esilright">
            <div class="exercisename">{{ exercise.name }}</div>
            <div v-for="muscle in exercise.muscles_worked" class="muscleworked">
              <div class="muscleworkedtext">{{ muscle }}</div>
            </div>
          </div>
        </div>
        <div class="exerciseselectoritemimagediv">
          <img src="">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
