'use server';

import { z } from 'zod';
import { 
  Exercise, 
  CreateExerciseInput, 
  UpdateExerciseInput 
} from '@/features/core/types/exercise.types';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';
import { getDatabase, toApiResponseArray } from '@/features/core/utils/database.utils';
import { createDocument, getDocument, updateDocument, deleteDocument, listDocuments } from '@/features/core/utils/crud.utils';
import { buildErrorResponse } from '@/features/core/utils/server-action-utils';

const createExerciseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  sets: z.number().min(0).optional(),
  reps: z.number().min(0).optional(),
  duration: z.number().min(0).optional(),
  restTime: z.number().min(0).optional(),
  muscleGroups: z.array(z.string()).min(1, 'At least one muscle group is required'),
});

const updateExerciseSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  sets: z.number().min(0).optional(),
  reps: z.number().min(0).optional(),
  duration: z.number().min(0).optional(),
  restTime: z.number().min(0).optional(),
  muscleGroups: z.array(z.string()).optional(),
});

export async function createExerciseAction(input: CreateExerciseInput) {
  return createDocument<Exercise>(
    'exercises',
    input,
    createExerciseSchema,
    'exercise'
  );
}

export async function getExerciseAction(id: string) {
  const result = await getDocument<Exercise>('exercises', id, 'exercise');
  // Map generic 'notFound' error to specific 'exerciseNotFound' error
  if (!result.success && result.error === TRANSLATIONS.errors.notFound) {
    return buildErrorResponse(TRANSLATIONS.errors.exerciseNotFound);
  }
  return result;
}

export async function updateExerciseAction(id: string, input: UpdateExerciseInput) {
  const result = await updateDocument<Exercise>(
    'exercises',
    id,
    input,
    updateExerciseSchema,
    'exercise'
  );
  // Map generic 'notFound' error to specific 'exerciseNotFound' error
  if (!result.success && result.error === TRANSLATIONS.errors.notFound) {
    return buildErrorResponse(TRANSLATIONS.errors.exerciseNotFound);
  }
  return result;
}

export async function deleteExerciseAction(id: string) {
  const result = await deleteDocument('exercises', id, 'exercise');
  // Map generic 'notFound' error to specific 'exerciseNotFound' error
  if (!result.success && result.error === TRANSLATIONS.errors.notFound) {
    return buildErrorResponse(TRANSLATIONS.errors.exerciseNotFound);
  }
  return result;
}

export async function listExercisesAction() {
  return listDocuments<Exercise>(
    'exercises',
    {},
    { name: 1 },
    'exercises'
  );
}

