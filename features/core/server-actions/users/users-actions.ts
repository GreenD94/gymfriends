'use server';

import { z } from 'zod';
import { 
  CreateUserPayload, 
  UpdateUserPayload,
  UserDocument,
} from '@/features/core/types/user.types';
import { getRoleId, ALL_ROLE_NAMES, RoleName } from '@/features/core/constants/roles.constants';
import { userToDb } from '@/features/core/utils/role.utils';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';
import { getDatabase, toObjectId } from '@/features/core/utils/database.utils';
import { handleServerAction, buildErrorResponse } from '@/features/core/utils/server-action-utils';
import { hashPassword } from '@/features/core/utils/password.utils';
import { checkUserExistsByEmail, convertUserToResponse } from '@/features/core/utils/user.utils';
import { userORM } from '@/features/core/orm';
import { apiResponse } from '@/features/core/utils/api-response.utils';

const createUserSchema = z.object({
  email: z.string().email(TRANSLATIONS.validation.invalidEmailFormat),
  password: z.string().min(6, TRANSLATIONS.validation.passwordMinLength).optional(),
  name: z.string().min(2, TRANSLATIONS.validation.nameMinLength),
  role: z.enum(ALL_ROLE_NAMES as [string, ...string[]]),
  phone: z.string().optional(),
  instagram: z.string().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  role: z.enum(ALL_ROLE_NAMES as [string, ...string[]]).optional(),
});

export async function createUserAction(input: CreateUserPayload) {
  return handleServerAction(async () => {
    const validated = createUserSchema.parse(input);
    
    const userExists = await checkUserExistsByEmail(validated.email);
    if (userExists) {
      return buildErrorResponse(TRANSLATIONS.errors.userExists);
    }

    let hashedPassword: string | undefined;
    if (validated.password) {
      hashedPassword = await hashPassword(validated.password);
    }

    const userForDb = userToDb({
      email: validated.email,
      password: hashedPassword,
      name: validated.name,
      role: validated.role as RoleName,
      phone: validated.phone,
      instagram: validated.instagram,
      createdAt: new Date(),
    });

    const db = await getDatabase();
    const result = await db.collection('users').insertOne(userForDb);

    const userDb: UserDocument = {
      _id: result.insertedId.toString(),
      email: userForDb.email,
      password: userForDb.password,
      name: userForDb.name,
      roleId: userForDb.roleId,
      phone: userForDb.phone,
      instagram: userForDb.instagram,
      createdAt: userForDb.createdAt,
    };
    
    const userWithoutPassword = convertUserToResponse(userDb);

    return {
      success: true,
      user: userWithoutPassword,
    };
  }, 'Create user');
}


export async function updateUserAction(id: string, input: UpdateUserPayload) {
  return handleServerAction(async () => {
    const validated = updateUserSchema.parse(input);
    const db = await getDatabase();
    
    const updateData: Partial<UserDocument> = {
      updatedAt: new Date(),
    };

    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.phone !== undefined) updateData.phone = validated.phone;
    if (validated.instagram !== undefined) updateData.instagram = validated.instagram;

    if (validated.role) {
      updateData.roleId = getRoleId(validated.role as RoleName);
    }

    const result = await db.collection('users').updateOne(
      { _id: toObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return buildErrorResponse(TRANSLATIONS.errors.userNotFound);
    }

    const resultList = await userORM({
      query: { _id: id },
    });

    if (resultList.collection.length === 0) {
      return buildErrorResponse(TRANSLATIONS.errors.userNotFoundAfterUpdate);
    }

    const updatedUserDb = resultList.collection[0];
    const userWithoutPassword = convertUserToResponse(updatedUserDb);

    return {
      success: true,
      user: userWithoutPassword,
    };
  }, 'Update user');
}

export async function deleteUserAction(id: string) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    
    const result = await db.collection('users').deleteOne({ 
      _id: toObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return buildErrorResponse(TRANSLATIONS.errors.userNotFound);
    }

    return { success: true };
  }, 'Delete user');
}

export async function listUsersAction(page?: number, limit?: number, _id?: string) {
  const query: Record<string, unknown> = {_id};

  const result = await userORM({
    query,
    sort: { createdAt: -1 },
    page,
    pageSize: limit,
  });

  return apiResponse(result);
}

