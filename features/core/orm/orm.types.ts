import { WithId } from 'mongodb';

export interface OrmQueryOptions<T> {
  query?: Record<string, unknown>;
  sort?: Record<string, 1 | -1>;
  page?: number;
  pageSize?: number;
}

export interface OrmResult<T> {
  collection: WithId<T>[];
  page: number;
  pageSize: number;
  total: number;
}

