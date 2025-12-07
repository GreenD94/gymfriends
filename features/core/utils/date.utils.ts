/**
 * Date utility functions
 * Centralized date operations for consistency
 */

/**
 * Build a MongoDB date range query
 * 
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @returns MongoDB query object with $gte and $lte operators
 */
export function buildDateRangeQuery(
  startDate?: Date,
  endDate?: Date
): Record<string, any> {
  const query: Record<string, any> = {};
  
  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = startDate;
    }
    if (endDate) {
      query.date.$lte = endDate;
    }
  }
  
  return query;
}

/**
 * Calculate the end date of a week (6 days after start date)
 * 
 * @param weekStart - Start date of the week
 * @returns End date of the week (weekStart + 6 days)
 */
export function calculateWeekEnd(weekStart: Date): Date {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
}

