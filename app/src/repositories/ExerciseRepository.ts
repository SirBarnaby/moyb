// src/repositories/exercise.repository.ts
import ApiServiceSingleton from "@/services/ApiServiceSingleton.ts";
import type { Exercise } from '@/dal/Exercise';
const BASE_URL = "/Exercise/"

export class ExerciseRepository {
  /**
   * Get all exercises
   */
  async findAll(): Promise<Exercise[]> {
    return await ApiServiceSingleton.get<Exercise[]>(BASE_URL);
  }

  /**
   * Get a single exercise by ID
   */
  async findById(id: string): Promise<Exercise> {
    return await ApiServiceSingleton.get<Exercise>(BASE_URL + `${id}`);
  }

  /**
   * Search exercises by name or description
   */
  async search(term: string): Promise<Exercise[]> {
    return await ApiServiceSingleton.get<Exercise[]>(BASE_URL + 'search', { term });
  }

  /**
   * Get exercises that target a specific muscle
   */
  async findByMuscle(muscleId: string): Promise<Exercise[]> {
    return await ApiServiceSingleton.get<Exercise[]>(BASE_URL + `muscle/${muscleId}`);
  }

  /**
   * Get exercises of the input target muscle
   */
  async findByTargetMuscle(muscleName: string): Promise<Exercise[]> {
    return await ApiServiceSingleton.get<Exercise[]>(BASE_URL + `main-muscle/${muscleName}`);
  }
}

export default new ExerciseRepository();
