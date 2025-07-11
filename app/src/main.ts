import './assets/main.css'
import './assets/v0.css'

import { ExerciseRepository } from "@/repositories/ExerciseRepository.ts";
import { MuscleRepository } from "@/repositories/MuscleRepository.ts";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

export const exerciseRepository = new ExerciseRepository();
export const muscleRepository = new MuscleRepository();

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
