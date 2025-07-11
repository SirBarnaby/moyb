import ApiServiceSingleton from "@/services/ApiServiceSingleton.ts";
import type { Muscle } from "@/core/muscle/Muscle.entity";

export class MuscleRepository {
  /**
   * Get all muscles
   */
  async findAll(): Promise<Muscle[]> {
    return await ApiServiceSingleton.get<Muscle[]>('/Muscles');
  }

  /**
   * Get a single muscle by ID
   */
  async findById(id: string): Promise<Muscle> {
    return await ApiServiceSingleton.get<Muscle>(`/Muscles/${id}`);
  }

  /**
   * Search muscles by name, Latin name, or description
   */
  async search(term: string): Promise<Muscle[]> {
    return await ApiServiceSingleton.get<Muscle[]>('/Muscles/search', { term });
  }

  /**
   * Get muscles targeted by a specific exercise
   */
  async findByExercise(exerciseId: string): Promise<Muscle[]> {
    return await ApiServiceSingleton.get<Muscle[]>(`/Muscles/by-exercise/${exerciseId}`);
  }
}

export default new MuscleRepository();
