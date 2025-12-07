'use server';

import { z } from 'zod';
import { 
  DailyAssignment, 
  CreateDailyAssignmentInput, 
  UpdateDailyAssignmentInput,
  WeeklyAssignmentInput,
} from '@/features/core/types/daily-assignment.types';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';
import { getDatabase, toApiResponse, toApiResponseArray, toObjectId } from '@/features/core/utils/database.utils';
import { handleServerAction, buildErrorResponse } from '@/features/core/utils/server-action-utils';
import { buildDateRangeQuery, calculateWeekEnd } from '@/features/core/utils/date.utils';

// Note: z.any() is used here for flexible meal/exercise data structures
// that can vary in shape. This allows assignments to store different types
// of meal and exercise data without strict typing constraints.
const createDailyAssignmentSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  date: z.coerce.date(),
  meals: z.array(z.any()), // Flexible meal data structure
  exercises: z.array(z.any()), // Flexible exercise data structure
  assignedBy: z.string().min(1, 'Assigned by is required'),
});

const weeklyAssignmentSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  startDate: z.coerce.date(),
  meals: z.array(z.object({
    day: z.number().min(0).max(6),
    meals: z.array(z.any()), // Flexible meal data structure
  })),
  exercises: z.array(z.object({
    day: z.number().min(0).max(6),
    exercises: z.array(z.any()), // Flexible exercise data structure
  })),
  assignedBy: z.string().min(1, 'Assigned by is required'),
});

export async function createDailyAssignmentAction(input: CreateDailyAssignmentInput) {
  return handleServerAction(async () => {
    const validated = createDailyAssignmentSchema.parse(input);
    const db = await getDatabase();
    
    const newAssignment: DailyAssignment = {
      ...validated,
      createdAt: new Date(),
    };

    const result = await db.collection('dailyAssignments').insertOne(newAssignment);
    const assignment = toApiResponse({ ...newAssignment, _id: result.insertedId } as DailyAssignment & { _id: any }, result.insertedId.toString());

    if (!assignment) {
      return buildErrorResponse(TRANSLATIONS.errors.genericError);
    }

    return {
      success: true,
      assignment,
    };
  }, 'Create daily assignment');
}

export async function createWeeklyAssignmentsAction(input: WeeklyAssignmentInput) {
  return handleServerAction(async () => {
    const validated = weeklyAssignmentSchema.parse(input);
    const db = await getDatabase();
    
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
      assignments: Object.values(result.insertedIds).map((id, index) => {
        const assignment = toApiResponse({ ...assignments[index], _id: id } as DailyAssignment & { _id: any }, id.toString());
        return assignment || { ...assignments[index], _id: id.toString() };
      }),
    };
  }, 'Create weekly assignments');
}

export async function getDailyAssignmentAction(id: string) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    const assignment = await db.collection<DailyAssignment>('dailyAssignments').findOne({ 
      _id: toObjectId(id) 
    });

    if (!assignment) {
      return buildErrorResponse(TRANSLATIONS.errors.assignmentNotFound);
    }

    const response = toApiResponse(assignment, id);
    if (!response) {
      return buildErrorResponse(TRANSLATIONS.errors.assignmentNotFound);
    }

    return {
      success: true,
      assignment: response,
    };
  }, 'Get daily assignment');
}

export async function updateDailyAssignmentAction(
  id: string, 
  input: UpdateDailyAssignmentInput
) {
  return handleServerAction(async () => {
    const validated = createDailyAssignmentSchema.partial().parse(input);
    const db = await getDatabase();
    
    const updateData: Partial<DailyAssignment> = {
      ...validated,
      updatedAt: new Date(),
    };

    const result = await db.collection('dailyAssignments').updateOne(
      { _id: toObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return buildErrorResponse(TRANSLATIONS.errors.assignmentNotFound);
    }

    const updatedAssignment = await db.collection<DailyAssignment>('dailyAssignments').findOne({ 
      _id: toObjectId(id) 
    });

    if (!updatedAssignment) {
      return buildErrorResponse(TRANSLATIONS.errors.assignmentNotFound);
    }

    const response = toApiResponse(updatedAssignment, id);
    if (!response) {
      return buildErrorResponse(TRANSLATIONS.errors.assignmentNotFound);
    }

    return {
      success: true,
      assignment: response,
    };
  }, 'Update daily assignment');
}

export async function deleteDailyAssignmentAction(id: string) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    
    const result = await db.collection('dailyAssignments').deleteOne({ 
      _id: toObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return buildErrorResponse(TRANSLATIONS.errors.assignmentNotFound);
    }

    return { success: true };
  }, 'Delete daily assignment');
}

export async function listDailyAssignmentsAction(customerId?: string, startDate?: Date, endDate?: Date) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    
    const query: Record<string, any> = {};
    if (customerId) {
      query.customerId = customerId;
    }
    
    // Use date utility to build date range query
    const dateRangeQuery = buildDateRangeQuery(startDate, endDate);
    Object.assign(query, dateRangeQuery);
    
    const assignments = await db.collection<DailyAssignment>('dailyAssignments')
      .find(query)
      .sort({ date: 1 })
      .toArray();

    return {
      success: true,
      assignments: toApiResponseArray(assignments),
    };
  }, 'List daily assignments');
}

export async function getWeeklyAssignmentsAction(customerId: string, weekStart: Date) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    
    // Use date utility to calculate week end
    const weekEnd = calculateWeekEnd(weekStart);
    
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
      assignments: toApiResponseArray(assignments),
    };
  }, 'Get weekly assignments');
}

