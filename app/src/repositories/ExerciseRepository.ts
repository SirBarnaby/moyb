// src/repositories/exercise.repository.ts
import ApiServiceSingleton from "@/services/ApiServiceSingleton.ts";
import type { Exercise } from '@/dal/Exercise';

export class ExerciseRepository {
  /**
   * Get all exercises
   */
  async findAll(): Promise<Exercise[]> {
    return await ApiServiceSingleton.get<Exercise[]>('/Exercises');
  }

  /**
   * Get a single exercise by ID
   */
  async findById(id: string): Promise<Exercise> {
    return await ApiServiceSingleton.get<Exercise>(`/Exercises/${id}`);
  }

  /**
   * Search exercises by name or description
   */
  async search(term: string): Promise<Exercise[]> {
    return await ApiServiceSingleton.get<Exercise[]>('/Exercises/search', { term });
  }

  /**
   * Get exercises that target a specific muscle
   */
  async findByMuscle(muscleId: string): Promise<Exercise[]> {
    return await ApiServiceSingleton.get<Exercise[]>(`/Exercises/by-muscle/${muscleId}`);
  }

  /**
   * Get exercises of the input target muscle
   */
  async findByTargetMuscle(muscleName: string): Promise<Exercise[]> {
    return await ApiServiceSingleton.get<Exercise[]>(`/Exercises/by-main-muscle/${muscleName}`);
  }
}

export default new ExerciseRepository();
