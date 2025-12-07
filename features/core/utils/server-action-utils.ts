import { z } from 'zod';
import { TRANSLATIONS } from '../constants/translations.constants';

/**
 * Standardized result type for server actions
 * All server actions should return this structure
 */
export type ActionResult<T = void> = 
  | { success: true; [key: string]: T | boolean | string | number | Date | T[] | undefined | any }
  | { success: false; error: string };

/**
 * Wraps server action with consistent error handling
 * Handles Zod validation errors and generic errors
 * 
 * @param action - Async function that returns ActionResult
 * @param errorContext - Context string for error logging (e.g., 'Create user')
 * @returns ActionResult with consistent error handling
 * 
 * @example
 * ```typescript
 * export async function createUserAction(input: CreateUserInput) {
 *   return handleServerAction(async () => {
 *     const validated = schema.parse(input);
 *     // ... action logic
 *     return { success: true, user: result };
 *   }, 'Create user');
 * }
 * ```
 */
export async function handleServerAction<T>(
  action: () => Promise<ActionResult<T>>,
  errorContext: string
): Promise<ActionResult<T>> {
  try {
    return await action();
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: firstError?.message || TRANSLATIONS.errors.genericError,
      };
    }
    
    // Log error for debugging
    console.error(`${errorContext} error:`, error);
    
    // Return generic error message
    return {
      success: false,
      error: TRANSLATIONS.errors.genericError,
    };
  }
}

/**
 * Build a standardized error response
 * General purpose helper to create error responses consistently
 * 
 * @param errorKey - Translation key for the error message (e.g., TRANSLATIONS.errors.userNotFound)
 * @returns ActionResult with error
 * 
 * @example
 * ```typescript
 * if (!user) {
 *   return buildErrorResponse(TRANSLATIONS.errors.userNotFound);
 * }
 * ```
 */
export function buildErrorResponse(errorKey: string): ActionResult {
  return {
    success: false,
    error: errorKey,
  };
}

/**
 * Build a standardized "not found" error response
 * Alias for buildErrorResponse for backward compatibility
 * 
 * @param errorKey - Translation key for the error message (e.g., TRANSLATIONS.errors.userNotFound)
 * @returns ActionResult with not found error
 * @deprecated Use buildErrorResponse instead
 */
export function buildNotFoundResponse(errorKey: string): ActionResult {
  return buildErrorResponse(errorKey);
}

/**
 * Ensure an API response exists or return a not found error
 * Type-safe utility to check if response is null and return appropriate error
 * 
 * @param response - Response object that may be null
 * @param errorKey - Translation key for the error message if response is null
 * @returns The response if it exists, or throws an error (to be caught by handleServerAction)
 * 
 * @example
 * ```typescript
 * const response = toApiResponse(document, id);
 * if (!response) {
 *   return buildNotFoundResponse(TRANSLATIONS.errors.userNotFound);
 * }
 * ```
 */
export function ensureApiResponse<T>(
  response: T | null,
  errorKey: string
): T {
  if (!response) {
    throw new Error(errorKey);
  }
  return response;
}

