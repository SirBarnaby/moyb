/**
 * AI-Primer: This interface defines the shape of data required to create a Muscle.
 * It allows for optional properties to be either null or undefined, providing flexibility
 * when mapping from different data sources (e.g., APIs, repositories).
 */
export interface MuscleProps {
  id: number;
  name: string;
  nameLatin?: string | null;
  description?: string | null;
  dominantFiberType?: string | null;
  enduranceRatingFactor?: string | null;
  recoveryTimeFactor?: string | null;
  neuralDriveSensitivityFactor?: string | null;
  motorUnitRecruitmentSpeedFactor?: string | null;
  stretchSensitivityFactor?: string | null;
  eccentricStrengthFactor?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * AI-Primer: This class represents the core Muscle domain entity.
 * It is a pure data container with no business logic or framework dependencies.
 * All properties are readonly to enforce immutability.
 */
export class Muscle {
  public readonly id: number;
  public readonly name: string;
  public readonly nameLatin: string | null;
  public readonly description: string | null;
  public readonly dominantFiberType: string | null;
  public readonly enduranceRatingFactor: string | null;
  public readonly recoveryTimeFactor: string | null;
  public readonly neuralDriveSensitivityFactor: string | null;
  public readonly motorUnitRecruitmentSpeedFactor: string | null;
  public readonly stretchSensitivityFactor: string | null;
  public readonly eccentricStrengthFactor: string | null;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  private constructor(props: MuscleProps) {
    this.id = props.id;
    this.name = props.name;
    this.nameLatin = props.nameLatin ?? null;
    this.description = props.description ?? null;
    this.dominantFiberType = props.dominantFiberType ?? null;
    this.enduranceRatingFactor = props.enduranceRatingFactor ?? null;
    this.recoveryTimeFactor = props.recoveryTimeFactor ?? null;
    this.neuralDriveSensitivityFactor = props.neuralDriveSensitivityFactor ?? null;
    this.motorUnitRecruitmentSpeedFactor =
      props.motorUnitRecruitmentSpeedFactor ?? null;
    this.stretchSensitivityFactor = props.stretchSensitivityFactor ?? null;
    this.eccentricStrengthFactor = props.eccentricStrengthFactor ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Factory method to create a Muscle instance.
   * Ensures that all required properties are provided and valid.
   */
  public static create(props: MuscleProps): Muscle {
    // Potential for validation logic here in the future (e.g., with Zod)
    return new Muscle(props);
  }
}
