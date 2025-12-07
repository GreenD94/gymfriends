'use server';

import { z } from 'zod';
import { UserDb, CreateUserInput } from '@/features/core/types/user.types';
import { RoleId, RoleName, ALL_ROLE_NAMES } from '@/features/core/constants/roles.constants';
import { userToDb } from '@/features/core/utils/role.utils';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';
import { getDatabase, toApiResponse } from '@/features/core/utils/database.utils';
import { handleServerAction, buildErrorResponse } from '@/features/core/utils/server-action-utils';
import { hashPassword, comparePassword } from '@/features/core/utils/password.utils';
import { checkUserExistsByEmail, convertUserToResponse, getUserByEmailOrFail } from '@/features/core/utils/user.utils';

const loginSchema = z.object({
  email: z.string().email(TRANSLATIONS.validation.invalidEmailFormat),
  password: z.string().min(6, TRANSLATIONS.validation.passwordMinLength),
});

const registerSchema = z.object({
  email: z.string().email(TRANSLATIONS.validation.invalidEmailFormat),
  password: z.string().min(6, TRANSLATIONS.validation.passwordMinLength),
  name: z.string().min(2, TRANSLATIONS.validation.nameMinLength),
  role: z.enum(ALL_ROLE_NAMES as [string, ...string[]]),
  phone: z.string().optional(),
  instagram: z.string().optional(),
});

export async function loginAction(email: string, password: string) {
  return handleServerAction(async () => {
    const validated = loginSchema.parse({ email, password });
    
    try {
      const userDb = await getUserByEmailOrFail(validated.email);
      
      if (!userDb.password) {
        return buildErrorResponse(TRANSLATIONS.errors.invalidEmailOrPassword);
      }

      const isValid = await comparePassword(validated.password, userDb.password);
      
      if (!isValid) {
        return buildErrorResponse(TRANSLATIONS.errors.invalidEmailOrPassword);
      }

      const userWithoutPassword = convertUserToResponse(userDb);

      return {
        success: true,
        user: userWithoutPassword,
      };
    } catch (error) {
      return buildErrorResponse(TRANSLATIONS.errors.invalidEmailOrPassword);
    }
  }, 'Login');
}

export async function registerAction(input: CreateUserInput) {
  return handleServerAction(async () => {
    const validated = registerSchema.parse(input);
    
    // Check if user already exists
    const userExists = await checkUserExistsByEmail(validated.email);
    if (userExists) {
      return buildErrorResponse(TRANSLATIONS.errors.userExists);
    }

    // Hash password
    const hashedPassword = await hashPassword(validated.password!);

    // Convert UI input (with role name) to database format (with roleId)
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

    // Convert back to UI format for response
    const userDb = toApiResponse({ ...userForDb, _id: result.insertedId } as UserDb & { _id: any }, result.insertedId.toString());
    if (!userDb) {
      return buildErrorResponse(TRANSLATIONS.errors.genericError);
    }
    
    const userWithoutPassword = convertUserToResponse(userDb);

    return {
      success: true,
      user: userWithoutPassword,
    };
  }, 'Register');
}

export async function getUserByEmailAction(email: string) {
  return handleServerAction(async () => {
    try {
      const userDb = await getUserByEmailOrFail(email);
      const userWithoutPassword = convertUserToResponse(userDb);

      return {
        success: true,
        user: userWithoutPassword,
      };
    } catch (error) {
      return buildErrorResponse(TRANSLATIONS.errors.userNotFound);
    }
  }, 'Get user by email');
}

export async function createOrUpdateOAuthUserAction(
  email: string,
  name: string,
  image?: string
) {
  return handleServerAction(async () => {
    const db = await getDatabase();
    
    const existingUserDb = await db.collection<UserDb>('users').findOne({ email }) as UserDb | null;

    if (existingUserDb) {
      // Update existing user
      await db.collection('users').updateOne(
        { email },
        { $set: { updatedAt: new Date() } }
      );
      // Convert to UI format
      const userWithoutPassword = convertUserToResponse(existingUserDb);
      return {
        success: true,
        user: userWithoutPassword,
        isNew: false,
      };
    }

    // Create new user with default role as customer (using roleId)
    const newUserDb: Omit<UserDb, '_id'> = {
      email,
      name,
      roleId: RoleId.CUSTOMER,
      createdAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUserDb);
    
    // Convert to UI format for response
    const userDb = toApiResponse({ ...newUserDb, _id: result.insertedId } as UserDb & { _id: any }, result.insertedId.toString());
    if (!userDb) {
      return buildErrorResponse(TRANSLATIONS.errors.genericError);
    }
    
    const userWithoutPassword = convertUserToResponse(userDb);

    return {
      success: true,
      user: userWithoutPassword,
      isNew: true,
    };
  }, 'Create or update OAuth user');
}

