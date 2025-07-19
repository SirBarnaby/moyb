import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import App from '@/App.vue';
import { useMuscleStore } from '@/stores/muscle.store';
import { useWorkoutPlanStore } from '@/stores/workoutPlan.store';
import { useAllExercisesStore } from '@/stores/exercise.store';
import { Exercise } from '@/core/exercise/Exercise.entity';
import { Muscle } from '@/core/muscle/Muscle.entity';

// Mock the repositories and dependencies
vi.mock('@/main', () => ({
  muscleRepository: {
    search: vi.fn(),
  },
  exerciseRepository: {
    findByMuscle: vi.fn(),
    search: vi.fn(),
  }
}));

vi.mock('@/config/animations', () => ({
  ANIMATION_CONFIG: {
    intro: {
      fadeOut: {
        duration: 0.1 // Speed up for testing
      }
    }
  }
}));

// Mock exercise data
const mockBenchPressExercise: Exercise = {
  id: 'bench-press-1',
  name: 'Bench Press',
  description: 'Classic chest exercise',
  equipmentRequired: 'Barbell',
  movementType: 'Push',
  popularity: 95,
  rangeOfMotion: 85,
  injuryRiskFactor: 'Medium',
  jointStressFactor: 'Medium',
  cnsFatigueFactor: 'High',
  isUnilateral: false,
  isHighSpinalLoad: false,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  mainMuscle: 'Chest',
  imageUrl: '/images/bench-press.jpg',
  muscleInExercises: [
    {
      id: '1',
      exerciseId: 'bench-press-1',
      muscleId: 'chest-1',
      role: 'Primary',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ]
};

const mockChestMuscle: Muscle = {
  id: 'chest-1',
  name: 'Chest',
  scientificName: 'Pectoralis Major',
  description: 'Primary chest muscle',
  origin: 'Clavicle and sternum',
  insertion: 'Humerus',
  primaryFunction: 'Horizontal adduction',
  secondaryFunction: 'Shoulder flexion',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

describe('App Integration Test - Complete User Flow', () => {
  let wrapper: any;
  let muscleStore: any;
  let workoutPlanStore: any;
  let exerciseStore: any;

  beforeEach(async () => {
    // Setup fresh Pinia instance
    const pinia = createPinia();
    setActivePinia(pinia);

    // Get store instances
    muscleStore = useMuscleStore();
    workoutPlanStore = useWorkoutPlanStore();
    exerciseStore = useAllExercisesStore();

    // Mock the repository methods
    const { muscleRepository, exerciseRepository } = await import('@/main');
    vi.mocked(muscleRepository.search).mockResolvedValue([mockChestMuscle]);
    vi.mocked(exerciseRepository.findByMuscle).mockResolvedValue([mockBenchPressExercise]);

    // Mount the App component
    wrapper = mount(App, {
      global: {
        plugins: [pinia],
        stubs: {
          // Stub components that might cause issues in testing
          'IntroSequence': {
            template: '<div data-testid="intro-sequence"><button @click="$emit(\'intro-complete\')" data-testid="skip-intro">Skip Intro</button></div>'
          }
        }
      }
    });
  });

  it('Test1: Complete user flow - intro -> muscle selection -> exercise selection -> add sets', async () => {
    // Step 1: Verify intro screen is visible initially
    expect(wrapper.find('[data-testid="intro-sequence"]').exists()).toBe(true);
    expect(wrapper.find('.main-content').classes()).not.toContain('fade-in');

    // Step 2: Complete intro sequence
    await wrapper.find('[data-testid="skip-intro"]').trigger('click');
    
    // Wait for intro completion animation
    await new Promise(resolve => setTimeout(resolve, 150));
    await wrapper.vm.$nextTick();

    // Verify main content is now visible and intro is hidden
    expect(wrapper.find('.main-content').classes()).toContain('fade-in');

    // Step 3: Verify ExerciseSelector is initially hidden
    const exerciseSelector = wrapper.findComponent({ name: 'ExerciseSelector' });
    expect(exerciseSelector.exists()).toBe(true);
    expect(exerciseSelector.props('isVisible')).toBe(false);

    // Step 4: Simulate clicking on chest muscle (SVG element)
    // This would normally be done by clicking on an SVG element in BodySection
    // For testing, we'll directly trigger the muscle selection
    await muscleStore.loadMuscleByName('Chest');
    await wrapper.vm.$nextTick();

    // Verify ExerciseSelector becomes visible
    expect(exerciseSelector.props('isVisible')).toBe(true);
    expect(exerciseSelector.props('isSearchMode')).toBe(false);

    // Step 5: Verify ExerciseSelectorMain is now visible
    const exerciseSelectorMain = wrapper.findComponent({ name: 'ExerciseSelectorMain' });
    expect(exerciseSelectorMain.exists()).toBe(true);

    // Step 6: Simulate selecting bench press exercise
    // In a real scenario, this would involve clicking on the exercise in the UI
    // For testing, we'll simulate the exercise selection event
    await exerciseSelectorMain.vm.$emit('exercise-selected', mockBenchPressExercise);
    await wrapper.vm.$nextTick();

    // Step 7: Add 3 sets to the workout plan
    workoutPlanStore.addExercise(mockBenchPressExercise, 3);
    await wrapper.vm.$nextTick();

    // Step 8: Verify the exercise was added with 3 sets
    expect(workoutPlanStore.exercises).toHaveLength(1);
    expect(workoutPlanStore.exercises[0].id).toBe('bench-press-1');
    expect(workoutPlanStore.exercises[0].name).toBe('Bench Press');
    expect(workoutPlanStore.exerciseSets[0]).toBe(3);

    // Step 9: Verify ExerciseSelector remains visible after adding sets
    // This is the correct behavior - it should stay visible until user clicks empty space
    expect(exerciseSelector.props('isVisible')).toBe(true);

    // Step 10: Verify muscle store still has the selected muscle (not cleared)
    expect(muscleStore.muscle).toBeTruthy();
    expect(muscleStore.muscle?.name).toBe('Chest');
  });

  it('should handle multiple exercise additions correctly', async () => {
    // Add bench press with 3 sets
    workoutPlanStore.addExercise(mockBenchPressExercise, 3);
    
    // Add the same exercise again with 2 more sets
    workoutPlanStore.addExercise(mockBenchPressExercise, 2);

    // Should accumulate to 5 sets total
    expect(workoutPlanStore.exercises).toHaveLength(1);
    expect(workoutPlanStore.exerciseSets[0]).toBe(5);
  });

  it('should handle exercise removal correctly', async () => {
    // Add exercise first
    workoutPlanStore.addExercise(mockBenchPressExercise, 3);
    expect(workoutPlanStore.exercises).toHaveLength(1);

    // Remove exercise
    workoutPlanStore.removeExercise(mockBenchPressExercise);
    expect(workoutPlanStore.exercises).toHaveLength(0);
    expect(workoutPlanStore.exerciseSets).toHaveLength(0);
  });

  it('should handle exercise set updates correctly', async () => {
    // Add exercise first
    workoutPlanStore.addExercise(mockBenchPressExercise, 3);
    
    // Update sets to 5
    workoutPlanStore.updateExerciseSets(mockBenchPressExercise, 5);
    expect(workoutPlanStore.exerciseSets[0]).toBe(5);

    // Update sets to 0 (should remove exercise)
    workoutPlanStore.updateExerciseSets(mockBenchPressExercise, 0);
    expect(workoutPlanStore.exercises).toHaveLength(0);
  });

  it('should maintain proper component visibility states', async () => {
    const exerciseSelector = wrapper.findComponent({ name: 'ExerciseSelector' });
    
    // Initially hidden
    expect(exerciseSelector.props('isVisible')).toBe(false);

    // Show when muscle is selected
    await muscleStore.loadMuscleByName('Chest');
    await wrapper.vm.$nextTick();
    expect(exerciseSelector.props('isVisible')).toBe(true);

    // Hide when muscle is cleared
    muscleStore.muscle = null;
    await wrapper.vm.$nextTick();
    expect(exerciseSelector.props('isVisible')).toBe(false);

    // Show when search is active
    exerciseStore.isSearchActive = true;
    await wrapper.vm.$nextTick();
    expect(exerciseSelector.props('isVisible')).toBe(true);
    expect(exerciseSelector.props('isSearchMode')).toBe(true);
  });
});
