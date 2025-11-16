export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  _id?: string;
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: MealType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMealInput {
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: MealType;
}

export interface UpdateMealInput {
  name?: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  mealType?: MealType;
}

