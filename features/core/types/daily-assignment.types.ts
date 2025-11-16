import { Meal } from './meal.types';
import { Exercise } from './exercise.types';

export interface DailyAssignment {
  _id?: string;
  customerId: string;
  date: Date;
  meals: Meal[];
  exercises: Exercise[];
  assignedBy: string; // trainerId
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateDailyAssignmentInput {
  customerId: string;
  date: Date;
  meals: Meal[];
  exercises: Exercise[];
  assignedBy: string;
}

export interface UpdateDailyAssignmentInput {
  date?: Date;
  meals?: Meal[];
  exercises?: Exercise[];
}

export interface WeeklyAssignmentInput {
  customerId: string;
  startDate: Date; // Monday of the week
  meals: {
    day: number; // 0-6
    meals: Meal[];
  }[];
  exercises: {
    day: number; // 0-6
    exercises: Exercise[];
  }[];
  assignedBy: string;
}

