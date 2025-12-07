'use server';

import { z } from 'zod';
import { 
  MealTemplate,
  ExerciseTemplate,
  CreateMealTemplateInput,
  CreateExerciseTemplateInput,
  UpdateMealTemplateInput,
  UpdateExerciseTemplateInput,
} from '@/features/core/types/template.types';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';
import { getDatabase, toApiResponse, toApiResponseArray, toObjectId } from '@/features/core/utils/database.utils';
import { handleServerAction, buildErrorResponse } from '@/features/core/utils/server-action-utils';

// Note: z.any() is used here for flexible meal/exercise data structures
// that can vary in shape. This allows templates to store different types
// of meal and exercise data without strict typing constraints.
const createMealTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  meals: z.array(z.any()).min(1, 'At least one meal is required'),
  createdBy: z.string().min(1, 'Created by is required'),
});

const createExerciseTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  exercises: z.array(z.object({
    day: z.number().min(0).max(6),
    exercises: z.array(z.any()), // Flexible exercise data structure
  })),
  createdBy: z.string().min(1, 'Created by is required'),
});

export async function createMealTemplateAction(input: CreateMealTemplateInput) {
  return handleServerAction(async () => {
    const validated = createMealTemplateSchema.parse(input);
    const db = await getDatabase();
    
    const newTemplate: MealTemplate = {
      ...validated,
      createdAt: new Date(),
    };

    const result = await db.collection('mealTemplates').insertOne(newTemplate);
    const template = toApiResponse({ ...newTemplate, _id: result.insertedId } as MealTemplate & { _id: any }, result.insertedId.toString());

    if (!template) {
      return buildErrorResponse(TRANSLATIONS.errors.genericError);
    }

    return {
      success: true,
      template,
    };
  }, 'Create meal template');
}

export async function createExerciseTemplateAction(input: CreateExerciseTemplateInput) {
  return handleServerAction(async () => {
    const validated = createExerciseTemplateSchema.parse(input);
    const db = await getDatabase();
    
    const newTemplate: ExerciseTemplate = {
      ...validated,
      createdAt: new Date(),
    };

    const result = await db.collection('exerciseTemplates').insertOne(newTemplate);
    const template = toApiResponse({ ...newTemplate, _id: result.insertedId } as ExerciseTemplate & { _id: any }, result.insertedId.toString());

    if (!template) {
      return buildErrorResponse(TRANSLATIONS.errors.genericError);
    }

    return {
      success: true,
      template,
    };
  }, 'Create exercise template');
}

export async function getMealTemplateAction(id: string) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    const template = await db.collection<MealTemplate>('mealTemplates').findOne({ 
      _id: toObjectId(id) 
    });

    if (!template) {
      return buildErrorResponse(TRANSLATIONS.errors.templateNotFound);
    }

    const response = toApiResponse(template, id);
    if (!response) {
      return buildErrorResponse(TRANSLATIONS.errors.templateNotFound);
    }

    return {
      success: true,
      template: response,
    };
  }, 'Get meal template');
}

export async function getExerciseTemplateAction(id: string) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    const template = await db.collection<ExerciseTemplate>('exerciseTemplates').findOne({ 
      _id: toObjectId(id) 
    });

    if (!template) {
      return buildErrorResponse(TRANSLATIONS.errors.templateNotFound);
    }

    const response = toApiResponse(template, id);
    if (!response) {
      return buildErrorResponse(TRANSLATIONS.errors.templateNotFound);
    }

    return {
      success: true,
      template: response,
    };
  }, 'Get exercise template');
}

export async function updateMealTemplateAction(
  id: string, 
  input: UpdateMealTemplateInput
) {
  return handleServerAction(async () => {
    const validated = createMealTemplateSchema.partial().parse(input);
    const db = await getDatabase();
    
    const updateData: Partial<MealTemplate> = {
      ...validated,
      updatedAt: new Date(),
    };

    const result = await db.collection('mealTemplates').updateOne(
      { _id: toObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return buildErrorResponse(TRANSLATIONS.errors.templateNotFound);
    }

    const updatedTemplate = await db.collection<MealTemplate>('mealTemplates').findOne({ 
      _id: toObjectId(id) 
    });

    if (!updatedTemplate) {
      return buildErrorResponse(TRANSLATIONS.errors.templateNotFound);
    }

    const response = toApiResponse(updatedTemplate, id);
    if (!response) {
      return buildErrorResponse(TRANSLATIONS.errors.templateNotFound);
    }

    return {
      success: true,
      template: response,
    };
  }, 'Update meal template');
}

export async function updateExerciseTemplateAction(
  id: string, 
  input: UpdateExerciseTemplateInput
) {
  return handleServerAction(async () => {
    const validated = createExerciseTemplateSchema.partial().parse(input);
    const db = await getDatabase();
    
    const updateData: Partial<ExerciseTemplate> = {
      ...validated,
      updatedAt: new Date(),
    };

    const result = await db.collection('exerciseTemplates').updateOne(
      { _id: toObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return buildErrorResponse(TRANSLATIONS.errors.templateNotFound);
    }

    const updatedTemplate = await db.collection<ExerciseTemplate>('exerciseTemplates').findOne({ 
      _id: toObjectId(id) 
    });

    if (!updatedTemplate) {
      return buildErrorResponse(TRANSLATIONS.errors.templateNotFound);
    }

    const response = toApiResponse(updatedTemplate, id);
    if (!response) {
      return buildErrorResponse(TRANSLATIONS.errors.templateNotFound);
    }

    return {
      success: true,
      template: response,
    };
  }, 'Update exercise template');
}

export async function deleteMealTemplateAction(id: string) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    
    const result = await db.collection('mealTemplates').deleteOne({ 
      _id: toObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return buildErrorResponse(TRANSLATIONS.errors.templateNotFound);
    }

    return { success: true };
  }, 'Delete meal template');
}

export async function deleteExerciseTemplateAction(id: string) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    
    const result = await db.collection('exerciseTemplates').deleteOne({ 
      _id: toObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return buildErrorResponse(TRANSLATIONS.errors.templateNotFound);
    }

    return { success: true };
  }, 'Delete exercise template');
}

export async function listMealTemplatesAction(trainerId?: string) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    
    const query = trainerId ? { createdBy: trainerId } : {};
    const templates = await db.collection<MealTemplate>('mealTemplates')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return {
      success: true,
      templates: toApiResponseArray(templates),
    };
  }, 'List meal templates');
}

export async function listExerciseTemplatesAction(trainerId?: string) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    
    const query = trainerId ? { createdBy: trainerId } : {};
    const templates = await db.collection<ExerciseTemplate>('exerciseTemplates')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return {
      success: true,
      templates: toApiResponseArray(templates),
    };
  }, 'List exercise templates');
}

