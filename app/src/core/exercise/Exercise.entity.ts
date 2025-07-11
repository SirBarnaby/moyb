import type { MuscleInExercise } from "../muscle/MuscleInExercise.entity";

/**
 * AI-Primer: This class represents the core Exercise domain entity.
 * It is a pure data container with no business logic or framework dependencies.
 * All properties are readonly to enforce immutability.
 */
export class Exercise {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly equipmentRequired: string;
  public readonly movementType: string;
  public readonly popularity: number;
  public readonly rangeOfMotion: number;
  public readonly injuryRiskFactor: string;
  public readonly jointStressFactor: string;
  public readonly cnsFatigueFactor: string;
  public readonly isUnilateral: boolean;
  public readonly isHighSpinalLoad: boolean;
  public readonly createdAt: string;
  public readonly updatedAt: string;
  public readonly mainMuscle: string;
  public readonly imageUrl: string;
  public readonly muscleInExercises: readonly MuscleInExercise[];

  private constructor(props: {
    id: string;
    name: string;
    description: string;
    equipmentRequired: string;
    movementType: string;
    popularity: number;
    rangeOfMotion: number;
    injuryRiskFactor: string;
    jointStressFactor: string;
    cnsFatigueFactor: string;
    isUnilateral: boolean;
    isHighSpinalLoad: boolean;
    createdAt: string;
    updatedAt: string;
    mainMuscle: string;
    imageUrl: string;
    muscleInExercises: MuscleInExercise[];
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.equipmentRequired = props.equipmentRequired;
    this.movementType = props.movementType;
    this.popularity = props.popularity;
    this.rangeOfMotion = props.rangeOfMotion;
    this.injuryRiskFactor = props.injuryRiskFactor;
    this.jointStressFactor = props.jointStressFactor;
    this.cnsFatigueFactor = props.cnsFatigueFactor;
    this.isUnilateral = props.isUnilateral;
    this.isHighSpinalLoad = props.isHighSpinalLoad;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.mainMuscle = props.mainMuscle;
    this.imageUrl = props.imageUrl;
    this.muscleInExercises = props.muscleInExercises;
  }

  /**
   * Factory method to create an Exercise instance.
   * Ensures that all required properties are provided and valid.
   */
  public static create(props: Omit<Exercise, 'isCalisthenics' | 'isSpecial' | 'getAffectedMuscles'>): Exercise {
    // Potential for validation logic here in the future (e.g., with Zod)
    return new Exercise(props);
  }

  public getAffectedMuscles(): readonly MuscleInExercise[] {
    return this.muscleInExercises;
  }

  public isCalisthenics(): boolean {
    return this.equipmentRequired.toLowerCase().includes("bodyweight");
  }

  public isSpecial(): boolean {
    return this.movementType.toLowerCase().includes("special");
  }
}
