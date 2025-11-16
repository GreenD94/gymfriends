'use server';

import { z } from 'zod';
import clientPromise, { getDatabaseName } from '@/lib/mongodb';
import { 
  DailyAssignment, 
  CreateDailyAssignmentInput, 
  UpdateDailyAssignmentInput,
  WeeklyAssignmentInput,
} from '@/features/core/types/daily-assignment.types';
import { ObjectId } from 'mongodb';

const createDailyAssignmentSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  date: z.coerce.date(),
  meals: z.array(z.any()),
  exercises: z.array(z.any()),
  assignedBy: z.string().min(1, 'Assigned by is required'),
});

const weeklyAssignmentSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  startDate: z.coerce.date(),
  meals: z.array(z.object({
    day: z.number().min(0).max(6),
    meals: z.array(z.any()),
  })),
  exercises: z.array(z.object({
    day: z.number().min(0).max(6),
    exercises: z.array(z.any()),
  })),
  assignedBy: z.string().min(1, 'Assigned by is required'),
});

export async function createDailyAssignmentAction(input: CreateDailyAssignmentInput) {
  try {
    const validated = createDailyAssignmentSchema.parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const newAssignment: DailyAssignment = {
      ...validated,
      createdAt: new Date(),
    };

    const result = await db.collection('dailyAssignments').insertOne(newAssignment);

    return {
      success: true,
      assignment: {
        ...newAssignment,
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
    console.error('Create daily assignment error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function createWeeklyAssignmentsAction(input: WeeklyAssignmentInput) {
  try {
    const validated = weeklyAssignmentSchema.parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    // Create assignments for each day of the week
    const assignments: DailyAssignment[] = [];
    const startDate = new Date(validated.startDate);
    
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);
      
      const dayMeals = validated.meals.find(m => m.day === day)?.meals || [];
      const dayExercises = validated.exercises.find(e => e.day === day)?.exercises || [];
      
      assignments.push({
        customerId: validated.customerId,
        date: currentDate,
        meals: dayMeals,
        exercises: dayExercises,
        assignedBy: validated.assignedBy,
        createdAt: new Date(),
      });
    }

    const result = await db.collection('dailyAssignments').insertMany(assignments);

    return {
      success: true,
      assignments: Object.values(result.insertedIds).map((id, index) => ({
        ...assignments[index],
        _id: id.toString(),
      })),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    console.error('Create weekly assignments error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function getDailyAssignmentAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    const assignment = await db.collection<DailyAssignment>('dailyAssignments').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!assignment) {
      return { success: false, error: 'Assignment not found' };
    }

    return {
      success: true,
      assignment: {
        ...assignment,
        _id: assignment._id.toString(),
      },
    };
  } catch (error) {
    console.error('Get daily assignment error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function updateDailyAssignmentAction(
  id: string, 
  input: UpdateDailyAssignmentInput
) {
  try {
    const validated = createDailyAssignmentSchema.partial().parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const updateData: Partial<DailyAssignment> = {
      ...validated,
      updatedAt: new Date(),
    };

    const result = await db.collection('dailyAssignments').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Assignment not found' };
    }

    const updatedAssignment = await db.collection<DailyAssignment>('dailyAssignments').findOne({ 
      _id: new ObjectId(id) 
    });

    return {
      success: true,
      assignment: {
        ...updatedAssignment!,
        _id: updatedAssignment!._id.toString(),
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    console.error('Update daily assignment error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function deleteDailyAssignmentAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const result = await db.collection('dailyAssignments').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Assignment not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete daily assignment error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function listDailyAssignmentsAction(customerId?: string, startDate?: Date, endDate?: Date) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const query: any = {};
    if (customerId) {
      query.customerId = customerId;
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = startDate;
      }
      if (endDate) {
        query.date.$lte = endDate;
      }
    }
    
    const assignments = await db.collection<DailyAssignment>('dailyAssignments')
      .find(query)
      .sort({ date: 1 })
      .toArray();

    return {
      success: true,
      assignments: assignments.map(assignment => ({
        ...assignment,
        _id: assignment._id.toString(),
      })),
    };
  } catch (error) {
    console.error('List daily assignments error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function getWeeklyAssignmentsAction(customerId: string, weekStart: Date) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const assignments = await db.collection<DailyAssignment>('dailyAssignments')
      .find({
        customerId,
        date: {
          $gte: weekStart,
          $lte: weekEnd,
        },
      })
      .sort({ date: 1 })
      .toArray();

    return {
      success: true,
      assignments: assignments.map(assignment => ({
        ...assignment,
        _id: assignment._id.toString(),
      })),
    };
  } catch (error) {
    console.error('Get weekly assignments error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

