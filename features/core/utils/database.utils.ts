import { Db, ObjectId } from 'mongodb';
import clientPromise, { getDatabaseName } from '@/lib/mongodb';

/**
 * Cached database connection per request
 * Avoids multiple connections in the same request
 */
let cachedDb: Db | null = null;

/**
 * Get database connection
 * Returns cached connection if available, otherwise creates new one
 */
export async function getDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }
  
  const client = await clientPromise;
  cachedDb = client.db(getDatabaseName());
  return cachedDb;
}

/**
 * Reset database cache
 * Useful for testing or when you need a fresh connection
 */
export function resetDatabaseCache(): void {
  cachedDb = null;
}

/**
 * Convert MongoDB document to API response format
 * Converts ObjectId to string and handles optional _id
 * 
 * @param document - MongoDB document with optional _id
 * @param fallbackId - Fallback ID if document._id is missing
 * @returns Document with string _id or null if document is null
 */
export function toApiResponse<T extends { _id?: any }>(
  document: T | null,
  fallbackId?: string
): (T & { _id: string }) | null {
  if (!document) {
    return null;
  }
  
  return {
    ...document,
    _id: document._id?.toString() || fallbackId || '',
  } as T & { _id: string };
}

/**
 * Convert array of MongoDB documents to API response format
 * Filters out null documents
 * 
 * @param documents - Array of MongoDB documents
 * @returns Array of documents with string _id
 */
export function toApiResponseArray<T extends { _id?: any }>(
  documents: T[]
): (T & { _id: string })[] {
  return documents
    .map(doc => toApiResponse(doc))
    .filter((doc): doc is T & { _id: string } => doc !== null);
}

/**
 * Create ObjectId from string with validation
 * 
 * @param id - String to convert to ObjectId
 * @returns ObjectId instance
 * @throws Error if id is not a valid ObjectId format
 */
export function toObjectId(id: string): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId format');
  }
  return new ObjectId(id);
}

