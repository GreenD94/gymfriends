'use server';

import { z } from 'zod';
import clientPromise, { getDatabaseName } from '@/lib/mongodb';
import { 
  MealTemplate,
  ExerciseTemplate,
  CreateMealTemplateInput,
  CreateExerciseTemplateInput,
  UpdateMealTemplateInput,
  UpdateExerciseTemplateInput,
} from '@/features/core/types/template.types';
import { ObjectId } from 'mongodb';

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
    exercises: z.array(z.any()),
  })),
  createdBy: z.string().min(1, 'Created by is required'),
});

export async function createMealTemplateAction(input: CreateMealTemplateInput) {
  try {
    const validated = createMealTemplateSchema.parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const newTemplate: MealTemplate = {
      ...validated,
      createdAt: new Date(),
    };

    const result = await db.collection('mealTemplates').insertOne(newTemplate);

    return {
      success: true,
      template: {
        ...newTemplate,
        _id: result.insertedId.toString(),
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    console.error('Create meal template error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function createExerciseTemplateAction(input: CreateExerciseTemplateInput) {
  try {
    const validated = createExerciseTemplateSchema.parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const newTemplate: ExerciseTemplate = {
      ...validated,
      createdAt: new Date(),
    };

    const result = await db.collection('exerciseTemplates').insertOne(newTemplate);

    return {
      success: true,
      template: {
        ...newTemplate,
        _id: result.insertedId.toString(),
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    console.error('Create exercise template error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function getMealTemplateAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    const template = await db.collection<MealTemplate>('mealTemplates').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!template) {
      return { success: false, error: 'Template not found' };
    }

    return {
      success: true,
      template: {
        ...template,
        _id: template._id.toString(),
      },
    };
  } catch (error) {
    console.error('Get meal template error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function getExerciseTemplateAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    const template = await db.collection<ExerciseTemplate>('exerciseTemplates').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!template) {
      return { success: false, error: 'Template not found' };
    }

    return {
      success: true,
      template: {
        ...template,
        _id: template._id.toString(),
      },
    };
  } catch (error) {
    console.error('Get exercise template error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function updateMealTemplateAction(
  id: string, 
  input: UpdateMealTemplateInput
) {
  try {
    const validated = createMealTemplateSchema.partial().parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const updateData: Partial<MealTemplate> = {
      ...validated,
      updatedAt: new Date(),
    };

    const result = await db.collection('mealTemplates').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Template not found' };
    }

    const updatedTemplate = await db.collection<MealTemplate>('mealTemplates').findOne({ 
      _id: new ObjectId(id) 
    });

    return {
      success: true,
      template: {
        ...updatedTemplate!,
        _id: updatedTemplate!._id.toString(),
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    console.error('Update meal template error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function updateExerciseTemplateAction(
  id: string, 
  input: UpdateExerciseTemplateInput
) {
  try {
    const validated = createExerciseTemplateSchema.partial().parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const updateData: Partial<ExerciseTemplate> = {
      ...validated,
      updatedAt: new Date(),
    };

    const result = await db.collection('exerciseTemplates').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Template not found' };
    }

    const updatedTemplate = await db.collection<ExerciseTemplate>('exerciseTemplates').findOne({ 
      _id: new ObjectId(id) 
    });

    return {
      success: true,
      template: {
        ...updatedTemplate!,
        _id: updatedTemplate!._id.toString(),
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    console.error('Update exercise template error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function deleteMealTemplateAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const result = await db.collection('mealTemplates').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Template not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete meal template error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function deleteExerciseTemplateAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const result = await db.collection('exerciseTemplates').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Template not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete exercise template error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function listMealTemplatesAction(trainerId?: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const query = trainerId ? { createdBy: trainerId } : {};
    const templates = await db.collection<MealTemplate>('mealTemplates')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return {
      success: true,
      templates: templates.map(template => ({
        ...template,
        _id: template._id.toString(),
      })),
    };
  } catch (error) {
    console.error('List meal templates error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function listExerciseTemplatesAction(trainerId?: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const query = trainerId ? { createdBy: trainerId } : {};
    const templates = await db.collection<ExerciseTemplate>('exerciseTemplates')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return {
      success: true,
      templates: templates.map(template => ({
        ...template,
        _id: template._id.toString(),
      })),
    };
  } catch (error) {
    console.error('List exercise templates error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

