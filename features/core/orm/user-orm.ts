import { WithId } from 'mongodb';
import { UserDocument } from '@/features/core/types/user.types';
import { baseORM } from './base-orm';
import { OrmQueryOptions } from './orm.types';
import { toObjectId } from '@/features/core/utils/database.utils';

function convertToUserDocument(doc: WithId<UserDocument>): UserDocument {
  return {
    _id: doc._id.toString(),
    email: doc.email,
    password: doc.password,
    name: doc.name,
    roleId: doc.roleId,
    phone: doc.phone,
    instagram: doc.instagram,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export interface UserOrmResult {
  collection: UserDocument[];
  page: number;
  pageSize: number;
  total: number;
}

export async function userORM(
  options: OrmQueryOptions<UserDocument> = {}
): Promise<UserOrmResult> {
  const { query = {}, ...restOptions } = options;
  
  const processedQuery: Record<string, unknown> = { ...query };
  if (query._id && typeof query._id === 'string') {
    processedQuery._id = toObjectId(query._id);
  }
  
  const result = await baseORM<UserDocument>('users', {
    ...restOptions,
    query: processedQuery,
  });
  
  const collection = result.collection.map(convertToUserDocument);
  
  return {
    collection,
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
  };
}

