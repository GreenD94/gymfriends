'use server';

import { z } from 'zod';
import { 
  Meal, 
  CreateMealInput, 
  UpdateMealInput 
} from '@/features/core/types/meal.types';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';
import { createDocument, getDocument, updateDocument, deleteDocument, listDocuments } from '@/features/core/utils/crud.utils';
import { buildErrorResponse } from '@/features/core/utils/server-action-utils';

const createMealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fats: z.number().min(0),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
});

const updateMealSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fats: z.number().min(0).optional(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
});

export async function createMealAction(input: CreateMealInput) {
  return createDocument<Meal>(
    'meals',
    input,
    createMealSchema,
    'meal'
  );
}

export async function getMealAction(id: string) {
  const result = await getDocument<Meal>('meals', id, 'meal');
  // Map generic 'notFound' error to specific 'mealNotFound' error
  if (!result.success && result.error === TRANSLATIONS.errors.notFound) {
    return buildErrorResponse(TRANSLATIONS.errors.mealNotFound);
  }
  return result;
}

export async function updateMealAction(id: string, input: UpdateMealInput) {
  const result = await updateDocument<Meal>(
    'meals',
    id,
    input,
    updateMealSchema,
    'meal'
  );
  // Map generic 'notFound' error to specific 'mealNotFound' error
  if (!result.success && result.error === TRANSLATIONS.errors.notFound) {
    return buildErrorResponse(TRANSLATIONS.errors.mealNotFound);
  }
  return result;
}

export async function deleteMealAction(id: string) {
  const result = await deleteDocument('meals', id, 'meal');
  // Map generic 'notFound' error to specific 'mealNotFound' error
  if (!result.success && result.error === TRANSLATIONS.errors.notFound) {
    return buildErrorResponse(TRANSLATIONS.errors.mealNotFound);
  }
  return result;
}

export async function listMealsAction(mealType?: string) {
  const query = mealType ? { mealType } : {};
  return listDocuments<Meal>(
    'meals',
    query,
    { name: 1 },
    'meals'
  );
}

