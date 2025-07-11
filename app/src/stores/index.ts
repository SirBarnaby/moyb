/**
 * AI-Primer: This barrel re-exports all Pinia store entry points so that
 * components and composables can import from a single location, aiding
 * discoverability and LLM reasoning.
 */
export { useAllExercisesStore } from './exercise.store';
export { useMuscleStore } from './muscle.store';
export { useWorkoutPlanStore } from './workoutPlan.store';
