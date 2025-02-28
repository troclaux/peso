export interface Exercise {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: number;
  exercise_id: number;
  sets: number;
  reps: number;
  order_number: number;
  name?: string;
  description?: string | null;
}

export interface Workout {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  exercises?: WorkoutExercise[];
}