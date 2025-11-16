import { Meal } from './meal.types';
import { Exercise } from './exercise.types';

export type TemplateType = 'meal' | 'exercise';

export interface MealTemplate {
  _id?: string;
  name: string;
  description?: string;
  meals: Meal[];
  createdBy: string; // trainerId
  createdAt: Date;
  updatedAt?: Date;
}

export interface ExerciseTemplate {
  _id?: string;
  name: string;
  description?: string;
  exercises: {
    day: number; // 0-6 (Sunday-Saturday)
    exercises: Exercise[];
  }[];
  createdBy: string; // trainerId
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateMealTemplateInput {
  name: string;
  description?: string;
  meals: Meal[];
  createdBy: string;
}

export interface CreateExerciseTemplateInput {
  name: string;
  description?: string;
  exercises: {
    day: number;
    exercises: Exercise[];
  }[];
  createdBy: string;
}

export interface UpdateMealTemplateInput {
  name?: string;
  description?: string;
  meals?: Meal[];
}

export interface UpdateExerciseTemplateInput {
  name?: string;
  description?: string;
  exercises?: {
    day: number;
    exercises: Exercise[];
  }[];
}

