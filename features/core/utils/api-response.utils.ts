/**
 * Standard API Response Utilities
 * Provides consistent API response format across all endpoints
 */

/**
 * Standard API response structure
 * All list endpoints should return this format
 */
export interface ApiResponse<T> {
  message: string;
  code: number;
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

/**
 * Options for creating an API response
 * Only message and code are required - pagination info comes from data
 */
export interface ApiResponseOptions {
  message: string;
  code: number;
}

/**
 * Create a standardized API response
 * 
 * @param data - Pagination object with collection, page, pageSize, and total
 * @param options - Response options (message, code)
 * @returns Standardized API response
 * 
 * @example
 * ```typescript
 * const result = await userORM({ query: {}, page: 1, pageSize: 10 });
 * return apiResponse(result, {
 *   message: 'Users retrieved successfully',
 *   code: 200,
 * });
 * ```
 */
export function apiResponse<T>(
  data: { collection: T[]; page: number; pageSize: number; total: number },
  options: ApiResponseOptions={ message: "retrieved successfully", code: 200 }
): ApiResponse<T> {
  const { message, code} = options;

  return {
    message,
    code,
    data: data.collection,
    page: data.page,
    pageSize: data.pageSize,
    total: data.total,
  };
}

