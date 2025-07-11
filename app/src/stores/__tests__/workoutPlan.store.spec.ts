import { setActivePinia, createPinia } from 'pinia';
import { useWorkoutPlanStore } from '../workoutPlan.store';
import { describe, it, expect, beforeEach } from 'vitest';

// Mock Exercise entity
const mockExercise = (id: string) => ({
  id,
  name: `Exercise ${id}`,
  description: '',
  equipmentRequired: '',
  movementType: '',
  popularity: 0,
  muscleInExercises: [],
  isSpecial: () => false,
});

describe('useWorkoutPlanStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('adds exercises and accumulates sets', () => {
    const store = useWorkoutPlanStore();
    const e1 = mockExercise('a');
    const e2 = mockExercise('b');

    store.addExercise(e1 as any, 4);
    store.addExercise(e2 as any, 3);
    store.addExercise(e1 as any, 2); // accumulate

    expect(store.exercises.length).toBe(2);
    const idx = store.exercises.findIndex((ex) => ex.id === 'a');
    expect(store.exerciseSets[idx]).toBe(6);
  });

  it('updates multipliers', () => {
    const store = useWorkoutPlanStore();
    store.updateMultipliers({
      setsPerWeekMax: 15,
      synergisticMultiplier: 0.4,
      stabilizingMultiplier: 0.25,
    });
    expect(store.setsPerWeekMax).toBe(15);
    expect(store.synergisticMultiplier).toBe(0.4);
    expect(store.stabilizingMultiplier).toBe(0.25);
  });
});
