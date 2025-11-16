'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';
import clientPromise, { getDatabaseName } from '@/lib/mongodb';
import { User, UserDb, CreateUserInput } from '@/features/core/types/user.types';
import { RoleId, getRoleId, getRoleName, ALL_ROLE_NAMES } from '@/features/core/constants/roles.constants';
import { userFromDb, userToDb } from '@/features/core/utils/role.utils';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';

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
  try {
    const validated = loginSchema.parse({ email, password });
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    const userDb = await db.collection<UserDb>('users').findOne({ 
      email: validated.email 
    }) as UserDb | null;

    if (!userDb || !userDb.password) {
      return { 
        success: false, 
        error: TRANSLATIONS.errors.invalidEmailOrPassword 
      };
    }

    const isValid = await bcrypt.compare(validated.password, userDb.password);
    
    if (!isValid) {
      return { 
        success: false, 
        error: TRANSLATIONS.errors.invalidEmailOrPassword 
      };
    }

    // Convert database user to UI user (adds role name from roleId)
    const user = userFromDb(userDb);
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    console.error('Login error:', error);
    return {
      success: false,
      error: TRANSLATIONS.errors.loginError,
    };
  }
}

export async function registerAction(input: CreateUserInput) {
  try {
    const validated = registerSchema.parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ 
      email: validated.email 
    });

    if (existingUser) {
      return {
        success: false,
        error: TRANSLATIONS.errors.userExists,
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password!, 10);

    // Convert UI input (with role name) to database format (with roleId)
    const userForDb = userToDb({
      email: validated.email,
      password: hashedPassword,
      name: validated.name,
      role: validated.role,
      phone: validated.phone,
      instagram: validated.instagram,
      createdAt: new Date(),
    });

    const result = await db.collection('users').insertOne(userForDb);

    // Convert back to UI format for response
    const userDb = { ...userForDb, _id: result.insertedId.toString() } as UserDb;
    const user = userFromDb(userDb);
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    console.error('Register error:', error);
    return {
      success: false,
      error: TRANSLATIONS.errors.registerError,
    };
  }
}

export async function getUserByEmailAction(email: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    const userDb = await db.collection<UserDb>('users').findOne({ email }) as UserDb | null;

    if (!userDb) {
      return { success: false, error: TRANSLATIONS.errors.userNotFound };
    }

    // Convert database user to UI user
    const user = userFromDb(userDb);
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error('Get user error:', error);
    return {
      success: false,
      error: TRANSLATIONS.errors.genericError,
    };
  }
}

export async function createOrUpdateOAuthUserAction(
  email: string,
  name: string,
  image?: string
) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const existingUserDb = await db.collection<UserDb>('users').findOne({ email }) as UserDb | null;

    if (existingUserDb) {
      // Update existing user
      await db.collection('users').updateOne(
        { email },
        { $set: { updatedAt: new Date() } }
      );
      // Convert to UI format
      const user = userFromDb(existingUserDb);
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        user: userWithoutPassword,
        isNew: false,
      };
    }

    // Create new user with default role as customer (using roleId)
    const newUserDb: UserDb = {
      email,
      name,
      roleId: RoleId.CUSTOMER,
      createdAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUserDb);
    
    // Convert to UI format for response
    const userDb = { ...newUserDb, _id: result.insertedId.toString() } as UserDb;
    const user = userFromDb(userDb);
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
      isNew: true,
    };
  } catch (error) {
    console.error('OAuth user creation error:', error);
    return {
      success: false,
      error: TRANSLATIONS.errors.genericError,
    };
  }
}

