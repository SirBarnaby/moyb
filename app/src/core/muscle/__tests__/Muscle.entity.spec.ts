import { describe, it, expect } from 'vitest';
import { Muscle } from '../Muscle.entity';

describe('Muscle Entity', () => {
  it('should create a muscle with the factory method', () => {
    const muscleData = {
      id: 1,
      name: 'Test Muscle',
      nameLatin: 'Musculus Testus',
      description: 'A muscle for testing',
      dominantFiberType: 'I',
      enduranceRatingFactor: 'high',
      recoveryTimeFactor: 'medium',
      neuralDriveSensitivityFactor: 'low',
      motorUnitRecruitmentSpeedFactor: 'fast',
      stretchSensitivityFactor: 'medium',
      eccentricStrengthFactor: 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const muscle = Muscle.create(muscleData);

    expect(muscle).toBeInstanceOf(Muscle);
    expect(muscle.name).toBe('Test Muscle');
    expect(muscle.nameLatin).toBe('Musculus Testus');
  });
});
