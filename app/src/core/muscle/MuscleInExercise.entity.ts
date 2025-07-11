/**
 * AI-Primer: This class represents the relationship between an Exercise and a Muscle.
 * It is a pure data container detailing how a muscle is involved in an exercise.
 * All properties are readonly to enforce immutability.
 */
export class MuscleInExercise {
  public readonly exerciseId: number;
  public readonly muscleId: number;
  public readonly contractionType: string;
  public readonly fatigueAccumulationFactor: string;
  public readonly muscleMovementCategory: string;

  private constructor(props: {
    exerciseId: number;
    muscleId: number;
    contractionType: string;
    fatigueAccumulationFactor: string;
    muscleMovementCategory: string;
  }) {
    this.exerciseId = props.exerciseId;
    this.muscleId = props.muscleId;
    this.contractionType = props.contractionType;
    this.fatigueAccumulationFactor = props.fatigueAccumulationFactor;
    this.muscleMovementCategory = props.muscleMovementCategory;
  }

  /**
   * Factory method to create a MuscleInExercise instance.
   */
  public static create(props: MuscleInExercise): MuscleInExercise {
    return new MuscleInExercise(props);
  }
}
