export class MuscleHelper {
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
  };
  public static initializeMuscleList(): MuscleHelper[] {
    const muscleList: MuscleHelper[] = []
    muscleList.push(new MuscleHelper("Abdominals", 1))
    muscleList.push(new MuscleHelper("Abductors", 2))
    muscleList.push(new MuscleHelper("Adductors", 3))
    muscleList.push(new MuscleHelper("Anterior Delts", 4))
    muscleList.push(new MuscleHelper("Biceps", 5))
    muscleList.push(new MuscleHelper("Calves", 6))
    muscleList.push(new MuscleHelper("Chest", 7))
    muscleList.push(new MuscleHelper("Forearm Extensors", 8))
    muscleList.push(new MuscleHelper("Forearm Flexors", 9))
    muscleList.push(new MuscleHelper("Glutes", 10))
    muscleList.push(new MuscleHelper("Hamstrings", 11))
    muscleList.push(new MuscleHelper("Lateral Delts", 12))
    muscleList.push(new MuscleHelper("Lats", 13))
    muscleList.push(new MuscleHelper("Lower Back", 14))
    muscleList.push(new MuscleHelper("Obliques", 15))
    muscleList.push(new MuscleHelper("Posterior Delts", 16))
    muscleList.push(new MuscleHelper("Quads", 17))
    muscleList.push(new MuscleHelper("Rotator Cuff", 18))
    muscleList.push(new MuscleHelper("Tibialis", 19))
    muscleList.push(new MuscleHelper("Trapezius", 20))
    muscleList.push(new MuscleHelper("Triceps", 21))
    return muscleList
  }
}


