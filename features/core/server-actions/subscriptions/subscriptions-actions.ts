'use server';

import { z } from 'zod';
import { 
  Subscription, 
  CreateSubscriptionInput, 
  UpdateSubscriptionInput,
} from '@/features/core/types/subscription.types';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';
import { getDatabase, toApiResponse, toApiResponseArray, toObjectId } from '@/features/core/utils/database.utils';
import { handleServerAction, buildErrorResponse } from '@/features/core/utils/server-action-utils';

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
  return handleServerAction(async () => {
    const validated = createSubscriptionSchema.parse(input);
    const db = await getDatabase();
    
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
    const subscription = toApiResponse({ ...newSubscription, _id: result.insertedId } as Subscription & { _id: any }, result.insertedId.toString());

    if (!subscription) {
      return buildErrorResponse(TRANSLATIONS.errors.genericError);
    }

    return {
      success: true,
      subscription,
    };
  }, 'Create subscription');
}

export async function getSubscriptionAction(id: string) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    const subscription = await db.collection<Subscription>('subscriptions').findOne({ 
      _id: toObjectId(id) 
    });

    if (!subscription) {
      return buildErrorResponse(TRANSLATIONS.errors.subscriptionNotFound);
    }

    const response = toApiResponse(subscription, id);
    if (!response) {
      return buildErrorResponse(TRANSLATIONS.errors.subscriptionNotFound);
    }

    return {
      success: true,
      subscription: response,
    };
  }, 'Get subscription');
}

export async function updateSubscriptionAction(
  id: string, 
  input: UpdateSubscriptionInput
) {
  return handleServerAction(async () => {
    const validated = updateSubscriptionSchema.parse(input);
    const db = await getDatabase();
    
    const updateData: Partial<Subscription> = {
      ...validated,
      updatedAt: new Date(),
    };

    const result = await db.collection('subscriptions').updateOne(
      { _id: toObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return buildErrorResponse(TRANSLATIONS.errors.subscriptionNotFound);
    }

    const updatedSubscription = await db.collection<Subscription>('subscriptions').findOne({ 
      _id: toObjectId(id) 
    });

    if (!updatedSubscription) {
      return buildErrorResponse(TRANSLATIONS.errors.subscriptionNotFound);
    }

    const response = toApiResponse(updatedSubscription, id);
    if (!response) {
      return buildErrorResponse(TRANSLATIONS.errors.subscriptionNotFound);
    }

    return {
      success: true,
      subscription: response,
    };
  }, 'Update subscription');
}

export async function deleteSubscriptionAction(id: string) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    
    const result = await db.collection('subscriptions').deleteOne({ 
      _id: toObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return buildErrorResponse(TRANSLATIONS.errors.subscriptionNotFound);
    }

    return { success: true };
  }, 'Delete subscription');
}

export async function listSubscriptionsAction(customerId?: string) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    
    const query = customerId ? { customerId } : {};
    const subscriptions = await db.collection<Subscription>('subscriptions')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return {
      success: true,
      subscriptions: toApiResponseArray(subscriptions),
    };
  }, 'List subscriptions');
}

export async function getActiveSubscriptionAction(customerId: string) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    const subscription = await db.collection<Subscription>('subscriptions')
      .findOne({ 
        customerId,
        status: 'active',
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      });

    if (!subscription) {
      return buildErrorResponse(TRANSLATIONS.errors.noActiveSubscription);
    }

    const response = toApiResponse(subscription);
    if (!response) {
      return buildErrorResponse(TRANSLATIONS.errors.noActiveSubscription);
    }

    return {
      success: true,
      subscription: response,
    };
  }, 'Get active subscription');
}

