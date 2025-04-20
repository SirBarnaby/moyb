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
export class MuscleHelper {
  static SYNERGIC_MULTIPLIER = 0.5;
  static STABILIZING_MULTIPLIER = 0.33;
  id: number
  nameOfMuscle: string
  setsPrimary: number
  setsSynergic: number
  setsStabilizing: number
  constructor(nameOfMuscle: string, id: number) {
    this.id = id
    this.nameOfMuscle = nameOfMuscle
    this.setsPrimary = 0
    this.setsSynergic = 0
    this.setsStabilizing = 0
  }
  public static initializeMuscleList(): MuscleHelper[] {
    return Object.entries(MUSCLES).map(([key, data]) =>
      new MuscleHelper(data.name, data.id)
    )
  }
  public static getMuscleNameById(id: number): string | undefined {
    const muscle = Object.values(MUSCLES).find(m => m.id === id)
    return muscle?.name
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
