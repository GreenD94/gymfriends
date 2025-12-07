import { Db, Document, Filter } from 'mongodb';
import { getDatabase } from '@/features/core/utils/database.utils';
import { OrmQueryOptions, OrmResult } from './orm.types';

const ENABLE_ORM_LOGGING = false;
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

function calculatePagination(page?: number, pageSize?: number): { skip: number; limit: number; page: number; pageSize: number } {
  const pageNumber = page ?? DEFAULT_PAGE;
  const limitValue = pageSize ?? DEFAULT_PAGE_SIZE;
  const skip = (pageNumber - 1) * limitValue;
  
  return { skip, limit: limitValue, page: pageNumber, pageSize: limitValue };
}

export async function baseORM<T extends Document>(
  collectionName: string,
  options: OrmQueryOptions<T> = {}
): Promise<OrmResult<T>> {
  const db: Db = await getDatabase();
  const { query = {}, sort = {}, page, pageSize } = options;

  const { skip, limit, page: pageNumber, pageSize: pageSizeValue } = calculatePagination(page, pageSize);
  const filterQuery: Filter<T> = query as Filter<T>;
  const total = await db.collection<T>(collectionName).countDocuments(filterQuery);
  let cursor = db.collection<T>(collectionName).find(filterQuery);

  const hasSortCriteria = Object.keys(sort).length > 0;
  if (hasSortCriteria) {
    cursor = cursor.sort(sort);
  }

  cursor = cursor.skip(skip).limit(limit);
  const results = await cursor.toArray();

  const shouldLog = ENABLE_ORM_LOGGING;
  if (shouldLog) {
    console.log(`[ORM] ${collectionName} query result:`, {
      collection: collectionName,
      query,
      sort,
      page: pageNumber,
      pageSize: pageSizeValue,
      skip,
      limit,
      total,
      count: results.length,
      results,
    });
  }

  return {
    collection: results,
    page: pageNumber,
    pageSize: pageSizeValue,
    total,
  };
}

