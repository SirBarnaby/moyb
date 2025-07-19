// Define a type for muscle data
type MuscleData = {
  id: number;
  name: string;
}

// Define all muscles in a single, maintainable object
const MUSCLES: Record<string, MuscleData> = {
  abs: { id: 1, name: "Abs" },
  abductors: { id: 2, name: "Abductors" },
  adductors: { id: 3, name: "Adductors" },
  frontdelts: { id: 4, name: "Front Delts" },
  biceps: { id: 5, name: "Biceps" },
  calves: { id: 6, name: "Calves" },
  chest: { id: 7, name: "Chest" },
  forearmextensors: { id: 8, name: "Forearm Extensors" },
  forearmflexors: { id: 9, name: "Forearm Flexors" },
  glutes: { id: 10, name: "Glutes" },
  hamstrings: { id: 11, name: "Hamstrings" },
  sidedelts: { id: 12, name: "Side Delts" },
  lats: { id: 13, name: "Lats" },
  lowerback: { id: 14, name: "Lower Back" },
  obliques: { id: 15, name: "Obliques" },
  reardelts: { id: 16, name: "Rear Delts" },
  quads: { id: 17, name: "Quads" },
  rotatorcuff: { id: 18, name: "Rotator Cuff" },
  tibialis: { id: 19, name: "Tibialis" },
  trapezius: { id: 20, name: "Trapezius" },
  triceps: { id: 21, name: "Triceps" },
  hipflexors: { id: 22, name: "Hip Flexors" }
}

const UPPER_BODY_MUSCLES = [4, 5, 7, 8, 9, 12, 13, 16, 18, 20, 21];
const LOWER_BODY_MUSCLES = [2, 3, 6, 10, 11, 17, 19, 22];
const CORE_MUSCLES = [1, 14, 15];

export class MuscleHelper {
  static SYNERGIC_MULTIPLIER = 0.5;
  static STABILIZING_MULTIPLIER = 0.33;
  id: number
  nameOfMuscle: string
  setsPrimary: number
  setsSynergic: number
  setsStabilizing: number
  bodyPart: 'upper' | 'lower' | 'core' | undefined;

  constructor(nameOfMuscle: string, id: number) {
    this.id = id
    this.nameOfMuscle = nameOfMuscle
    this.setsPrimary = 0
    this.setsSynergic = 0
    this.setsStabilizing = 0
    this.bodyPart = MuscleHelper.getMuscleBodyPart(id);
  }

  public static initializeMuscleList(): MuscleHelper[] {
    return Object.entries(MUSCLES).map(([, data]) =>
      new MuscleHelper(data.name, data.id)
    )
  }

  public static getMuscleNameById(id: number): string | undefined {
    const muscle = Object.values(MUSCLES).find(m => m.id === id)
    return muscle?.name
  }

  public static getMuscleIdByName(name: string): number | undefined {
    const muscle = Object.values(MUSCLES).find(m => m.name.toLowerCase() === name.toLowerCase())
    return muscle?.id
  }

  public static getMuscleBodyPart(id: number): 'upper' | 'lower' | 'core' | undefined {
    if (UPPER_BODY_MUSCLES.includes(id)) {
      return 'upper';
    } else if (LOWER_BODY_MUSCLES.includes(id)) {
      return 'lower';
    } else if (CORE_MUSCLES.includes(id)) {
      return 'core';
    }
    return undefined;
  }

  public addPrimarySets(amount: number) {
    this.setsPrimary += amount
  }

  public addSynergicSets(amount: number) {
    this.setsSynergic += amount
  }

  public addStabilizingSets(amount: number) {
    this.setsStabilizing += amount
  }

  public getTotalSetVolume(): number {
    return this.setsPrimary +
      (this.setsSynergic * MuscleHelper.SYNERGIC_MULTIPLIER) +
      (this.setsStabilizing * MuscleHelper.STABILIZING_MULTIPLIER)
  }
}
