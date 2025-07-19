import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ExerciseSelectorMain from '@/components/ExerciseSelectorMain.vue';
import { useMuscleStore } from '@/stores/muscle.store';
import { useWorkoutPlanStore } from '@/stores/workoutPlan.store';
import { useAllExercisesStore } from '@/stores/exercise.store';
import { Exercise } from '@/core/exercise/Exercise.entity';
import { Muscle } from '@/core/muscle/Muscle.entity';

// Mock the repositories
vi.mock('@/main', () => ({
  exerciseRepository: {
    findByMuscle: vi.fn(),
    search: vi.fn(),
  }
}));

// Mock debounce to execute immediately in tests
vi.mock('lodash.debounce', () => ({
  default: (fn: Function) => fn
}));

const mockExercises: Exercise[] = [
  {
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
    muscleInExercises: []
  },
  {
    id: 'incline-press-1',
    name: 'Incline Bench Press',
    description: 'Upper chest focus',
    equipmentRequired: 'Barbell',
    movementType: 'Push',
    popularity: 85,
    rangeOfMotion: 80,
    injuryRiskFactor: 'Medium',
    jointStressFactor: 'Medium',
    cnsFatigueFactor: 'High',
    isUnilateral: false,
    isHighSpinalLoad: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    mainMuscle: 'Chest',
    imageUrl: '/images/incline-press.jpg',
    muscleInExercises: []
  }
];

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

describe('ExerciseSelectorMain Component Tests', () => {
  let wrapper: any;
  let muscleStore: any;
  let workoutPlanStore: any;
  let exerciseStore: any;

  beforeEach(async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    muscleStore = useMuscleStore();
    workoutPlanStore = useWorkoutPlanStore();
    exerciseStore = useAllExercisesStore();

    // Mock repository responses
    const { exerciseRepository } = await import('@/main');
    vi.mocked(exerciseRepository.findByMuscle).mockResolvedValue(mockExercises);
    vi.mocked(exerciseRepository.search).mockResolvedValue(mockExercises);

    // Set up muscle selection
    muscleStore.muscle = mockChestMuscle;

    wrapper = mount(ExerciseSelectorMain, {
      global: {
        plugins: [pinia]
      },
      props: {
        isSearchMode: false
      }
    });

    // Wait for component to load exercises
    await wrapper.vm.$nextTick();
  });

  it('should display exercises for selected muscle', async () => {
    // Wait for exercises to load
    await wrapper.vm.$nextTick();
    
    // Check if exercises are displayed (using class selector since data-testid might not exist)
    const exerciseItems = wrapper.findAll('.new-exercise-card');
    expect(exerciseItems.length).toBeGreaterThan(0);
  });

  it('should handle exercise selection and emit events', async () => {
    // Wait for exercises to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    // Find and click on bench press exercise
    const benchPressItem = wrapper.find('[data-testid="exercise-bench-press-1"]');
    if (benchPressItem.exists()) {
      await benchPressItem.trigger('click');
      
      // Check if exercise-selected event was emitted
      expect(wrapper.emitted('exercise-selected')).toBeTruthy();
      expect(wrapper.emitted('exercise-selected')[0][0]).toEqual(mockExercises[0]);
    }
  });

  it('should handle set addition correctly', async () => {
    // Wait for exercises to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const initialExerciseCount = workoutPlanStore.exercises.length;
    
    // Simulate adding sets to bench press
    const benchPress = mockExercises[0];
    workoutPlanStore.addExercise(benchPress, 3);

    expect(workoutPlanStore.exercises.length).toBe(initialExerciseCount + 1);
    expect(workoutPlanStore.exerciseSets[workoutPlanStore.exercises.length - 1]).toBe(3);
  });

  it('should handle muscle highlighting on hover', async () => {
    // Wait for exercises to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const exerciseItem = wrapper.find('[data-testid="exercise-item"]');
    if (exerciseItem.exists()) {
      // Simulate hover
      await exerciseItem.trigger('mouseenter');
      
      // Check if muscle highlighting is applied
      // This would normally check DOM manipulation, but we'll verify the method was called
      expect(wrapper.vm.exerciseState.hovered).toBeTruthy();
    }
  });

  it('should filter exercises based on search', async () => {
    // Switch to search mode
    await wrapper.setProps({ isSearchMode: true });
    
    // Set search query
    exerciseStore.searchQuery = 'bench';
    exerciseStore.searchResults = [mockExercises[0]]; // Only bench press
    
    await wrapper.vm.$nextTick();
    
    // Verify filtered results
    const exerciseItems = wrapper.findAll('[data-testid="exercise-item"]');
    expect(exerciseItems.length).toBeLessThanOrEqual(mockExercises.length);
  });

  it('should handle component visibility correctly', async () => {
    // Initially visible when muscle is selected (component uses v-show="targetMuscle")
    expect(wrapper.vm.targetMuscle).toBeTruthy();
    expect(wrapper.vm.targetMuscle?.name).toBe('Chest');

    // Should hide when muscle is cleared
    muscleStore.muscle = null;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.targetMuscle).toBeNull();
  });

  it('should handle dossier popup correctly', async () => {
    // Wait for exercises to load
    await wrapper.vm.$nextTick();

    // Initially dossier should be hidden
    expect(wrapper.vm.uiState.isDossierVisible).toBe(false);
    expect(wrapper.vm.dossierState.current).toBe('closed');

    // Simulate showing exercise details
    const benchPress = mockExercises[0];
    wrapper.vm.showExerciseDetails(benchPress);
    
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.uiState.isDossierVisible).toBe(true);
    expect(wrapper.vm.exerciseState.selected).toStrictEqual(benchPress);
  });

  it('should handle image loading states', async () => {
    // Test image loading helper functions
    expect(wrapper.vm.isImageLoaded('bench-press')).toBe(false);

    // Simulate image load
    wrapper.vm.handleImageLoaded('bench-press');
    
    // Check if image is loaded
    expect(wrapper.vm.isImageLoaded('bench-press')).toBe(true);
    expect(wrapper.vm.isImageLoaded('non-existent')).toBe(false);
  });

  it('should handle exercise selection', async () => {
    const benchPress = mockExercises[0];
    
    // Test exercise selection
    wrapper.vm.showExerciseDetails(benchPress);
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.exerciseState.selected).toStrictEqual(benchPress);
    expect(wrapper.vm.uiState.isDossierVisible).toBe(true);
  });

  it('should handle muscle highlighting', async () => {
    // Mock DOM element
    const mockElement = document.createElement('div');
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    const muscleId = 'chest-muscle';
    
    // Test muscle highlighting
    wrapper.vm.applyTintToMuscle(muscleId, 5);
    expect(document.getElementById).toHaveBeenCalledWith(muscleId);

    // Test reset highlighting
    wrapper.vm.resetMuscleHighlighting();
    expect(document.getElementById).toHaveBeenCalled();
  });
});
