<script setup lang="ts">
import { type Exercise, useExerciseStore } from "@/dal/Exercise.ts";
import { computed } from "vue";
import {type Muscle, useMuscleStore} from "@/dal/Muscle.ts";

const exerciseStore = useExerciseStore();
const muscleStore = useMuscleStore();
const exercises : Exercise[] = computed(() => exerciseStore.exercises);
const targetMuscle : Muscle = computed(() => muscleStore.muscle);
</script>

<template>
  <div class="exerciseselectormain">
    <div class="exerciseselectortop">
      <div class="hoverablearrow">&lt;arrow&gt;</div>
      <div class="exerciseselectortopdivider">
        <div class="exerciseselectortopleft">
          <div class="describingtext">{{ targetMuscle.description }}</div>
        </div>
        <div class="exerciseselectortopright">
          <div class="esmusclegroup">{{ targetMuscle.name }}</div>
          <div class="esmusclegrouplatin">{{ targetMuscle.nameLatin }}</div>
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
            <div v-for="muscle in exercise.musclesAffected" class="muscleworked">
              <div class="muscleworkedtext">{{ muscle }} {{ muscle.fatigue_accumulation_factor }}</div>
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
