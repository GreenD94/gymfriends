'use server';

import { z } from 'zod';
import clientPromise, { getDatabaseName } from '@/lib/mongodb';
import { 
  Meal, 
  CreateMealInput, 
  UpdateMealInput 
} from '@/features/core/types/meal.types';
import { ObjectId } from 'mongodb';

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
  try {
    const validated = createMealSchema.parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const newMeal: Meal = {
      ...validated,
      createdAt: new Date(),
    };

    const result = await db.collection('meals').insertOne(newMeal);

    return {
      success: true,
      meal: {
        ...newMeal,
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
    console.error('Create meal error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function getMealAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    const meal = await db.collection<Meal>('meals').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!meal) {
      return { success: false, error: 'Meal not found' };
    }

    return {
      success: true,
      meal: {
        ...meal,
        _id: meal._id.toString(),
      },
    };
  } catch (error) {
    console.error('Get meal error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function updateMealAction(id: string, input: UpdateMealInput) {
  try {
    const validated = updateMealSchema.parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const updateData: Partial<Meal> = {
      ...validated,
      updatedAt: new Date(),
    };

    const result = await db.collection('meals').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Meal not found' };
    }

    const updatedMeal = await db.collection<Meal>('meals').findOne({ 
      _id: new ObjectId(id) 
    });

    return {
      success: true,
      meal: {
        ...updatedMeal!,
        _id: updatedMeal!._id.toString(),
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    console.error('Update meal error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function deleteMealAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const result = await db.collection('meals').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Meal not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete meal error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function listMealsAction(mealType?: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const query = mealType ? { mealType } : {};
    const meals = await db.collection<Meal>('meals')
      .find(query)
      .sort({ name: 1 })
      .toArray();

    return {
      success: true,
      meals: meals.map(meal => ({
        ...meal,
        _id: meal._id.toString(),
      })),
    };
  } catch (error) {
    console.error('List meals error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

