import { z } from 'zod';
import { Db, ObjectId } from 'mongodb';
import { getDatabase, toApiResponse, toApiResponseArray, toObjectId } from './database.utils';
import { handleServerAction, ActionResult } from './server-action-utils';
import { TRANSLATIONS } from '../constants/translations.constants';

/**
 * Generic CRUD helper functions for common database operations
 * These can be used to reduce boilerplate in server actions
 * 
 * Note: These are optional utilities. You can use them for simple CRUD operations
 * or implement custom logic when needed.
 */

/**
 * Create a document in a collection
 * 
 * @param collectionName - Name of the MongoDB collection
 * @param data - Data to insert (will have createdAt added)
 * @param schema - Zod schema for validation
 * @param resourceName - Name for the response key (e.g., 'user', 'exercise')
 * @returns ActionResult with created document
 */
export async function createDocument<T extends { createdAt?: Date }>(
  collectionName: string,
  data: Omit<T, '_id' | 'createdAt'>,
  schema: z.ZodSchema,
  resourceName: string
): Promise<ActionResult<T & { _id: string }>> {
  return handleServerAction(async () => {
    const validated = schema.parse(data);
    const db = await getDatabase();
    
    const document = {
      ...validated,
      createdAt: new Date(),
    } as T;
    
    const result = await db.collection<T>(collectionName).insertOne(document);
    const created = toApiResponse({ ...document, _id: result.insertedId } as T & { _id: ObjectId });
    
    if (!created) {
      return {
        success: false,
        error: TRANSLATIONS.errors.genericError,
      };
    }
    
    return {
      success: true,
      [resourceName]: created,
    } as ActionResult<T & { _id: string }>;
  }, `Create ${resourceName}`);
}

/**
 * Get a document by ID
 * 
 * @param collectionName - Name of the MongoDB collection
 * @param id - Document ID
 * @param resourceName - Name for the response key and error messages
 * @returns ActionResult with document or not found error
 */
export async function getDocument<T extends { _id?: any }>(
  collectionName: string,
  id: string,
  resourceName: string
): Promise<ActionResult<T & { _id: string }>> {
  return handleServerAction(async () => {
    const db = await getDatabase();
    const document = await db.collection<T>(collectionName).findOne({ 
      _id: toObjectId(id) 
    });
    
    if (!document) {
      return {
        success: false,
        error: TRANSLATIONS.errors.notFound,
      };
    }
    
    const response = toApiResponse(document, id);
    if (!response) {
      return {
        success: false,
        error: TRANSLATIONS.errors.notFound,
      };
    }
    
    return {
      success: true,
      [resourceName]: response,
    } as ActionResult<T & { _id: string }>;
  }, `Get ${resourceName}`);
}

/**
 * Update a document by ID
 * 
 * @param collectionName - Name of the MongoDB collection
 * @param id - Document ID
 * @param data - Update data (will have updatedAt added)
 * @param schema - Zod schema for validation (should be partial)
 * @param resourceName - Name for the response key and error messages
 * @returns ActionResult with updated document
 */
export async function updateDocument<T extends { updatedAt?: Date }>(
  collectionName: string,
  id: string,
  data: Partial<T>,
  schema: z.ZodSchema,
  resourceName: string
): Promise<ActionResult<T & { _id: string }>> {
  return handleServerAction(async () => {
    const validated = schema.parse(data);
    const db = await getDatabase();
    
    const updateData = {
      ...validated,
      updatedAt: new Date(),
    } as Partial<T>;
    
    const result = await db.collection<T>(collectionName).updateOne(
      { _id: toObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return {
        success: false,
        error: TRANSLATIONS.errors.notFound,
      };
    }
    
    const updated = await db.collection<T>(collectionName).findOne({ 
      _id: toObjectId(id) 
    });
    
    if (!updated) {
      return {
        success: false,
        error: TRANSLATIONS.errors.notFound,
      };
    }
    
    const response = toApiResponse(updated, id);
    if (!response) {
      return {
        success: false,
        error: TRANSLATIONS.errors.notFound,
      };
    }
    
    return {
      success: true,
      [resourceName]: response,
    } as ActionResult<T & { _id: string }>;
  }, `Update ${resourceName}`);
}

/**
 * Delete a document by ID
 * 
 * @param collectionName - Name of the MongoDB collection
 * @param id - Document ID
 * @param resourceName - Name for error messages
 * @returns ActionResult with success or not found error
 */
export async function deleteDocument(
  collectionName: string,
  id: string,
  resourceName: string
): Promise<ActionResult> {
  return handleServerAction(async () => {
    const db = await getDatabase();
    const result = await db.collection(collectionName).deleteOne({ 
      _id: toObjectId(id) 
    });
    
    if (result.deletedCount === 0) {
      return {
        success: false,
        error: TRANSLATIONS.errors.notFound,
      };
    }
    
    return { success: true };
  }, `Delete ${resourceName}`);
}

/**
 * List documents with optional query and sort
 * 
 * @param collectionName - Name of the MongoDB collection
 * @param query - MongoDB query object (optional)
 * @param sort - Sort object (optional, e.g., { createdAt: -1 })
 * @param resourceName - Name for the response key (plural, e.g., 'users', 'exercises')
 * @returns ActionResult with array of documents
 */
export async function listDocuments<T extends { _id?: any }>(
  collectionName: string,
  query: Record<string, any> = {},
  sort: Record<string, 1 | -1> = {},
  resourceName: string
): Promise<ActionResult<T[]>> {
  return handleServerAction(async () => {
    const db = await getDatabase();
    let cursor = db.collection<T>(collectionName).find(query);
    
    if (Object.keys(sort).length > 0) {
      cursor = cursor.sort(sort);
    }
    
    const documents = await cursor.toArray();
    const response = toApiResponseArray(documents);
    
    return {
      success: true,
      [resourceName]: response,
    } as ActionResult<T[]>;
  }, `List ${resourceName}`);
}

