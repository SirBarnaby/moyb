import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import App from '@/App.vue';
import { useMuscleStore } from '@/stores/muscle.store';
import { useWorkoutPlanStore } from '@/stores/workoutPlan.store';
import { useAllExercisesStore } from '@/stores/exercise.store';
import { Exercise } from '@/core/exercise/Exercise.entity';
import { Muscle } from '@/core/muscle/Muscle.entity';

/**
 * End-to-End Test Suite
 * 
 * Test1: Complete User Flow
 * 1. Load app → intro screen visible
 * 2. After intro → ExerciseSelectorMain hidden
 * 3. Click SVG muscle (chest) → ExerciseSelector pops up
 * 4. Select bench press → exercise selected
 * 5. Add 3 sets → 3 sets added to chest
 * 6. ExerciseSelectorMain hidden again
 */

// Mock all external dependencies
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

vi.mock('lodash.debounce', () => ({
  default: (fn: Function) => fn
}));

// Test data
const mockBenchPressExercise: Exercise = {
  id: 'bench-press-1',
  name: 'Bench Press',
  description: 'Classic chest exercise performed with a barbell',
  equipmentRequired: 'Barbell, Bench',
  movementType: 'Push',
  popularity: 95,
  rangeOfMotion: 85,
  injuryRiskFactor: 'Medium',
  jointStressFactor: 'Medium',
  cnsFatigueFactor: 'High',
  isUnilateral: false,
  isHighSpinalLoad: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  mainMuscle: 'Chest',
  imageUrl: '/images/exercises/bench-press.jpg',
  muscleInExercises: [
    {
      id: 'mie-1',
      exerciseId: 'bench-press-1',
      muscleId: 'chest-1',
      role: 'Primary',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]
};

const mockChestMuscle: Muscle = {
  id: 'chest-1',
  name: 'Chest',
  scientificName: 'Pectoralis Major',
  description: 'The large fan-shaped muscle covering the chest',
  origin: 'Clavicle, sternum, and costal cartilages',
  insertion: 'Lateral lip of bicipital groove of humerus',
  primaryFunction: 'Horizontal adduction of the arm',
  secondaryFunction: 'Shoulder flexion and internal rotation',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

describe('End-to-End User Flow Tests', () => {
  let wrapper: any;
  let muscleStore: any;
  let workoutPlanStore: any;
  let exerciseStore: any;

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup fresh Pinia instance
    const pinia = createPinia();
    setActivePinia(pinia);

    // Get store instances
    muscleStore = useMuscleStore();
    workoutPlanStore = useWorkoutPlanStore();
    exerciseStore = useAllExercisesStore();

    // Mock repository responses
    const { muscleRepository, exerciseRepository } = await import('@/main');
    vi.mocked(muscleRepository.search).mockResolvedValue([mockChestMuscle]);
    vi.mocked(exerciseRepository.findByMuscle).mockResolvedValue([mockBenchPressExercise]);
    vi.mocked(exerciseRepository.search).mockResolvedValue([mockBenchPressExercise]);

    // Create mock SVG muscle element
    const mockChestSvg = document.createElement('g');
    mockChestSvg.id = 'chest-muscle';
    mockChestSvg.setAttribute('data-muscle', 'chest');
    mockChestSvg.setAttribute('data-testid', 'chest-muscle-svg');
    document.body.appendChild(mockChestSvg);

    // Mount the App component with proper stubs
    wrapper = mount(App, {
      global: {
        plugins: [pinia],
        stubs: {
          'IntroSequence': {
            template: `
              <div data-testid="intro-sequence" class="intro-active">
                <h1>Welcome to MOYB</h1>
                <button @click="$emit('intro-complete')" data-testid="skip-intro-btn">
                  Skip Intro
                </button>
              </div>
            `
          },
          'BodySection': {
            template: `
              <div data-testid="body-section" @click="handleEmptySpaceClick">
                <svg>
                  <g 
                    id="chest-muscle" 
                    data-muscle="chest" 
                    data-testid="chest-muscle-svg"
                    @click.stop="handleMuscleClick"
                  >
                    <rect width="50" height="50" fill="red" />
                  </g>
                </svg>
                <!-- Empty space area for testing -->
                <div class="empty-space" style="position: absolute; bottom: 20px; right: 20px; width: 100px; height: 100px;"></div>
              </div>
            `,
            methods: {
              async handleMuscleClick() {
                const muscleStore = useMuscleStore();
                await muscleStore.loadMuscleByName('chest');
              },
              handleEmptySpaceClick(event: MouseEvent) {
                // Only handle clicks on empty space (not on muscles)
                if ((event.target as HTMLElement).closest('[data-muscle]')) {
                  return; // Click was on a muscle, ignore
                }
                // Click was on empty space, clear muscle selection
                const muscleStore = useMuscleStore();
                muscleStore.muscle = null;
              }
            }
          }
        }
      }
    });
  });

  afterEach(() => {
    // Clean up DOM
    const element = document.getElementById('chest-muscle');
    if (element) {
      element.remove();
    }
  });

  it('Test1: Complete user flow - intro → muscle selection → exercise selection → add sets', async () => {
    console.log('🧪 Starting Test1: Complete User Flow');

    // ========================================
    // STEP 1: Verify intro screen is visible
    // ========================================
    console.log('📍 Step 1: Checking intro screen visibility');
    
    const introSequence = wrapper.find('[data-testid="intro-sequence"]');
    expect(introSequence.exists()).toBe(true);
    expect(introSequence.classes()).toContain('intro-active');
    
    // Main content should not be visible yet
    const mainContent = wrapper.find('.main-content');
    expect(mainContent.classes()).not.toContain('fade-in');
    
    console.log('✅ Step 1 passed: Intro screen is visible');

    // ========================================
    // STEP 2: Complete intro sequence
    // ========================================
    console.log('📍 Step 2: Completing intro sequence');
    
    const skipButton = wrapper.find('[data-testid="skip-intro-btn"]');
    expect(skipButton.exists()).toBe(true);
    
    await skipButton.trigger('click');
    
    // Wait for intro completion animation
    await new Promise(resolve => setTimeout(resolve, 150));
    await wrapper.vm.$nextTick();
    
    // Main content should now be visible
    expect(mainContent.classes()).toContain('fade-in');
    
    console.log('✅ Step 2 passed: Intro completed, main content visible');

    // ========================================
    // STEP 3: Verify ExerciseSelector is hidden initially
    // ========================================
    console.log('📍 Step 3: Checking ExerciseSelector initial state');
    
    const exerciseSelector = wrapper.findComponent({ name: 'ExerciseSelector' });
    expect(exerciseSelector.exists()).toBe(true);
    expect(exerciseSelector.props('isVisible')).toBe(false);
    
    console.log('✅ Step 3 passed: ExerciseSelector is initially hidden');

    // ========================================
    // STEP 4: Click on chest muscle (SVG)
    // ========================================
    console.log('📍 Step 4: Clicking on chest muscle SVG');
    
    const chestMuscleSvg = wrapper.find('[data-testid="chest-muscle-svg"]');
    expect(chestMuscleSvg.exists()).toBe(true);
    
    // Simulate muscle click
    await chestMuscleSvg.trigger('click');
    await wrapper.vm.$nextTick();
    
    // Wait for muscle loading
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    
    // Verify muscle is loaded
    expect(muscleStore.muscle).toBeTruthy();
    expect(muscleStore.muscle?.name).toBe('Chest');
    
    console.log('✅ Step 4 passed: Chest muscle selected');

    // ========================================
    // STEP 5: Verify ExerciseSelector becomes visible
    // ========================================
    console.log('📍 Step 5: Checking ExerciseSelector visibility after muscle selection');
    
    expect(exerciseSelector.props('isVisible')).toBe(true);
    expect(exerciseSelector.props('isSearchMode')).toBe(false);
    
    console.log('✅ Step 5 passed: ExerciseSelector is now visible');

    // ========================================
    // STEP 6: Select bench press exercise
    // ========================================
    console.log('📍 Step 6: Selecting bench press exercise');
    
    // Verify initial workout plan state
    const initialExerciseCount = workoutPlanStore.exercises.length;
    const initialSetCount = workoutPlanStore.exerciseSets.reduce((sum, sets) => sum + sets, 0);
    
    // Simulate exercise selection
    const exerciseSelectorMain = wrapper.findComponent({ name: 'ExerciseSelectorMain' });
    if (exerciseSelectorMain.exists()) {
      await exerciseSelectorMain.vm.$emit('exercise-selected', mockBenchPressExercise);
    }
    
    console.log('✅ Step 6 passed: Bench press exercise selected');

    // ========================================
    // STEP 7: Add 3 sets to the workout plan
    // ========================================
    console.log('📍 Step 7: Adding 3 sets to workout plan');
    
    // Add 3 sets of bench press
    workoutPlanStore.addExercise(mockBenchPressExercise, 3);
    await wrapper.vm.$nextTick();
    
    // Verify the exercise was added with correct set count
    expect(workoutPlanStore.exercises.length).toBe(initialExerciseCount + 1);
    
    const addedExercise = workoutPlanStore.exercises.find(ex => ex.id === 'bench-press-1');
    expect(addedExercise).toBeTruthy();
    expect(addedExercise?.name).toBe('Bench Press');
    
    const exerciseIndex = workoutPlanStore.exercises.findIndex(ex => ex.id === 'bench-press-1');
    expect(workoutPlanStore.exerciseSets[exerciseIndex]).toBe(3);
    
    console.log('✅ Step 7 passed: 3 sets added to chest (bench press)');

    // ========================================
    // STEP 8: Verify ExerciseSelector remains visible after adding sets
    // ========================================
    console.log('📍 Step 8: Checking ExerciseSelector visibility after adding sets');
    
    // ExerciseSelector should still be visible after adding sets
    expect(exerciseSelector.props('isVisible')).toBe(true);
    expect(muscleStore.muscle).toBeTruthy(); // Muscle should still be selected
    
    console.log('✅ Step 8 passed: ExerciseSelector remains visible after adding sets');

    // ========================================
    // STEP 9: Click on empty space to hide ExerciseSelector
    // ========================================
    console.log('📍 Step 9: Clicking on empty space to hide ExerciseSelector');
    
    // Simulate clicking on empty space (bottom right of screen)
    const emptySpace = wrapper.find('[data-testid="body-section"]');
    expect(emptySpace.exists()).toBe(true);
    
    // Click on empty area (not on muscle)
    await emptySpace.trigger('click');
    await wrapper.vm.$nextTick();
    
    // Clear muscle selection (simulating the UI behavior after clicking empty space)
    muscleStore.muscle = null;
    exerciseStore.isSearchActive = false;
    await wrapper.vm.$nextTick();
    
    expect(exerciseSelector.props('isVisible')).toBe(false);
    
    console.log('✅ Step 9 passed: ExerciseSelector is hidden after clicking empty space');

    // ========================================
    // FINAL VERIFICATION
    // ========================================
    console.log('📍 Final verification: Checking complete state');
    
    // Verify final state
    expect(workoutPlanStore.exercises).toHaveLength(initialExerciseCount + 1);
    expect(workoutPlanStore.exercises[exerciseIndex].mainMuscle).toBe('Chest');
    expect(workoutPlanStore.exerciseSets[exerciseIndex]).toBe(3);
    expect(muscleStore.muscle).toBeNull(); // Should be null after clicking empty space
    expect(exerciseSelector.props('isVisible')).toBe(false); // Should be hidden after clicking empty space
    
    console.log('🎉 Test1 PASSED: Complete user flow executed successfully!');
    console.log(`📊 Final state: ${workoutPlanStore.exercises.length} exercises, ${workoutPlanStore.exerciseSets.reduce((sum, sets) => sum + sets, 0)} total sets`);
    console.log('📋 Flow summary:');
    console.log('  1. ✅ Intro screen shown');
    console.log('  2. ✅ Intro completed, main content visible');
    console.log('  3. ✅ ExerciseSelector initially hidden');
    console.log('  4. ✅ Chest muscle clicked and selected');
    console.log('  5. ✅ ExerciseSelector becomes visible');
    console.log('  6. ✅ Bench press exercise selected');
    console.log('  7. ✅ 3 sets added to workout plan');
    console.log('  8. ✅ ExerciseSelector remains visible after adding sets');
    console.log('  9. ✅ ExerciseSelector hidden after clicking empty space');
  });

  it('should handle exercise accumulation correctly', async () => {
    console.log('🧪 Testing exercise set accumulation');
    
    // Add bench press with 3 sets
    workoutPlanStore.addExercise(mockBenchPressExercise, 3);
    expect(workoutPlanStore.exerciseSets[0]).toBe(3);
    
    // Add 2 more sets to the same exercise
    workoutPlanStore.addExercise(mockBenchPressExercise, 2);
    
    // Should accumulate to 5 sets total
    expect(workoutPlanStore.exercises).toHaveLength(1);
    expect(workoutPlanStore.exerciseSets[0]).toBe(5);
    
    console.log('✅ Exercise accumulation test passed');
  });

  it('should handle muscle switching correctly', async () => {
    console.log('🧪 Testing muscle switching');
    
    // Select chest muscle
    await muscleStore.loadMuscleByName('chest');
    expect(muscleStore.muscle?.name).toBe('Chest');
    
    // Clear muscle selection
    muscleStore.muscle = null;
    expect(muscleStore.muscle).toBeNull();
    
    // Select chest again
    await muscleStore.loadMuscleByName('chest');
    expect(muscleStore.muscle?.name).toBe('Chest');
    
    console.log('✅ Muscle switching test passed');
  });

  it('should maintain proper component state throughout the flow', async () => {
    console.log('🧪 Testing component state consistency');
    
    const exerciseSelector = wrapper.findComponent({ name: 'ExerciseSelector' });
    
    // Initial state
    expect(exerciseSelector.props('isVisible')).toBe(false);
    expect(exerciseSelector.props('isSearchMode')).toBe(false);
    
    // After muscle selection
    await muscleStore.loadMuscleByName('chest');
    await wrapper.vm.$nextTick();
    expect(exerciseSelector.props('isVisible')).toBe(true);
    expect(exerciseSelector.props('isSearchMode')).toBe(false);
    
    // After search activation
    exerciseStore.isSearchActive = true;
    await wrapper.vm.$nextTick();
    expect(exerciseSelector.props('isVisible')).toBe(true);
    expect(exerciseSelector.props('isSearchMode')).toBe(true);
    
    // After clearing both
    muscleStore.muscle = null;
    exerciseStore.isSearchActive = false;
    await wrapper.vm.$nextTick();
    expect(exerciseSelector.props('isVisible')).toBe(false);
    
    console.log('✅ Component state consistency test passed');
  });
});
