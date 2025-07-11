import { describe, it, expect } from 'vitest';
import { Exercise } from '../Exercise.entity';

describe('Exercise Entity', () => {
  it('should create an exercise with the factory method', () => {
    const exerciseData = {
      id: '1',
      name: 'Test Exercise',
      description: 'A test description',
      equipmentRequired: 'none',
      movementType: 'compound',
      popularity: 10,
      rangeOfMotion: 5,
      injuryRiskFactor: 'low',
      jointStressFactor: 'low',
      cnsFatigueFactor: 'medium',
      isUnilateral: false,
      isHighSpinalLoad: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mainMuscle: 'chest',
      imageUrl: 'http://example.com/image.png',
      muscleInExercises: [],
    };

    const exercise = Exercise.create(exerciseData);

    expect(exercise).toBeInstanceOf(Exercise);
    expect(exercise.name).toBe('Test Exercise');
    expect(exercise.isCalisthenics()).toBe(false);
  });
});
