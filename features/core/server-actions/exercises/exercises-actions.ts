'use server';

import { z } from 'zod';
import clientPromise, { getDatabaseName } from '@/lib/mongodb';
import { 
  Exercise, 
  CreateExerciseInput, 
  UpdateExerciseInput 
} from '@/features/core/types/exercise.types';
import { ObjectId } from 'mongodb';

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
  try {
    const validated = createExerciseSchema.parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const newExercise: Exercise = {
      ...validated,
      createdAt: new Date(),
    };

    const result = await db.collection('exercises').insertOne(newExercise);

    return {
      success: true,
      exercise: {
        ...newExercise,
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
    console.error('Create exercise error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function getExerciseAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    const exercise = await db.collection<Exercise>('exercises').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!exercise) {
      return { success: false, error: 'Exercise not found' };
    }

    return {
      success: true,
      exercise: {
        ...exercise,
        _id: exercise._id.toString(),
      },
    };
  } catch (error) {
    console.error('Get exercise error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function updateExerciseAction(id: string, input: UpdateExerciseInput) {
  try {
    const validated = updateExerciseSchema.parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const updateData: Partial<Exercise> = {
      ...validated,
      updatedAt: new Date(),
    };

    const result = await db.collection('exercises').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Exercise not found' };
    }

    const updatedExercise = await db.collection<Exercise>('exercises').findOne({ 
      _id: new ObjectId(id) 
    });

    return {
      success: true,
      exercise: {
        ...updatedExercise!,
        _id: updatedExercise!._id.toString(),
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    console.error('Update exercise error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function deleteExerciseAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const result = await db.collection('exercises').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Exercise not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete exercise error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function listExercisesAction() {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    const exercises = await db.collection<Exercise>('exercises')
      .find({})
      .sort({ name: 1 })
      .toArray();

    return {
      success: true,
      exercises: exercises.map(exercise => ({
        ...exercise,
        _id: exercise._id.toString(),
      })),
    };
  } catch (error) {
    console.error('List exercises error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

