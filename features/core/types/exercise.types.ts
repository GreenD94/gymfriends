export interface Exercise {
  _id?: string;
  name: string;
  description?: string;
  sets?: number;
  reps?: number;
  duration?: number; // in minutes
  restTime?: number; // in seconds
  muscleGroups: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateExerciseInput {
  name: string;
  description?: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
  muscleGroups: string[];
}

export interface UpdateExerciseInput {
  name?: string;
  description?: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
  muscleGroups?: string[];
}

