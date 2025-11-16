'use server';

import { z } from 'zod';
import clientPromise, { getDatabaseName } from '@/lib/mongodb';
import { 
  Subscription, 
  CreateSubscriptionInput, 
  UpdateSubscriptionInput,
  SubscriptionStatus 
} from '@/features/core/types/subscription.types';
import { ObjectId } from 'mongodb';

const createSubscriptionSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  planName: z.string().min(1, 'Plan name is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: z.enum(['active', 'expired', 'pending', 'cancelled']),
  paymentScreenshot: z.string().optional(),
  assignedBy: z.string().min(1, 'Assigned by is required'),
});

const updateSubscriptionSchema = z.object({
  planName: z.string().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(['active', 'expired', 'pending', 'cancelled']).optional(),
  paymentScreenshot: z.string().optional(),
});

export async function createSubscriptionAction(input: CreateSubscriptionInput) {
  try {
    const validated = createSubscriptionSchema.parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const newSubscription: Subscription = {
      customerId: validated.customerId,
      planName: validated.planName,
      startDate: validated.startDate,
      endDate: validated.endDate,
      status: validated.status,
      paymentScreenshot: validated.paymentScreenshot,
      assignedBy: validated.assignedBy,
      createdAt: new Date(),
    };

    const result = await db.collection('subscriptions').insertOne(newSubscription);

    return {
      success: true,
      subscription: {
        ...newSubscription,
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
    console.error('Create subscription error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function getSubscriptionAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    const subscription = await db.collection<Subscription>('subscriptions').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!subscription) {
      return { success: false, error: 'Subscription not found' };
    }

    return {
      success: true,
      subscription: {
        ...subscription,
        _id: subscription._id.toString(),
      },
    };
  } catch (error) {
    console.error('Get subscription error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function updateSubscriptionAction(
  id: string, 
  input: UpdateSubscriptionInput
) {
  try {
    const validated = updateSubscriptionSchema.parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const updateData: Partial<Subscription> = {
      ...validated,
      updatedAt: new Date(),
    };

    const result = await db.collection('subscriptions').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Subscription not found' };
    }

    const updatedSubscription = await db.collection<Subscription>('subscriptions').findOne({ 
      _id: new ObjectId(id) 
    });

    return {
      success: true,
      subscription: {
        ...updatedSubscription!,
        _id: updatedSubscription!._id.toString(),
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    console.error('Update subscription error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function deleteSubscriptionAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const result = await db.collection('subscriptions').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Subscription not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete subscription error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function listSubscriptionsAction(customerId?: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const query = customerId ? { customerId } : {};
    const subscriptions = await db.collection<Subscription>('subscriptions')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return {
      success: true,
      subscriptions: subscriptions.map(sub => ({
        ...sub,
        _id: sub._id.toString(),
      })),
    };
  } catch (error) {
    console.error('List subscriptions error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

export async function getActiveSubscriptionAction(customerId: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    const subscription = await db.collection<Subscription>('subscriptions')
      .findOne({ 
        customerId,
        status: 'active',
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      });

    if (!subscription) {
      return { success: false, error: 'No active subscription found' };
    }

    return {
      success: true,
      subscription: {
        ...subscription,
        _id: subscription._id.toString(),
      },
    };
  } catch (error) {
    console.error('Get active subscription error:', error);
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

