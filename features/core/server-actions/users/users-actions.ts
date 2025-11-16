'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import clientPromise, { getDatabaseName } from '@/lib/mongodb';
import { 
  User, 
  UserDb,
  CreateUserInput, 
  UpdateUserInput,
  UserRole 
} from '@/features/core/types/user.types';
import { ObjectId } from 'mongodb';
import { getRoleId, ALL_ROLE_NAMES } from '@/features/core/constants/roles.constants';
import { userFromDb, userToDb } from '@/features/core/utils/role.utils';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';

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

export async function createUserAction(input: CreateUserInput) {
  try {
    const validated = createUserSchema.parse(input);
    
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

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (validated.password) {
      hashedPassword = await bcrypt.hash(validated.password, 10);
    }

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
    console.error('Create user error:', error);
    return {
      success: false,
      error: TRANSLATIONS.errors.genericError,
    };
  }
}

export async function getUserAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    const userDb = await db.collection<UserDb>('users').findOne({ 
      _id: new ObjectId(id) 
    }) as UserDb | null;

    if (!userDb) {
      return { success: false, error: TRANSLATIONS.errors.userNotFound };
    }

    // Convert database user to UI user
    const user = userFromDb(userDb);
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      user: {
        ...userWithoutPassword,
        _id: userDb._id?.toString() || id,
      },
    };
  } catch (error) {
    console.error('Get user error:', error);
    return {
      success: false,
      error: TRANSLATIONS.errors.genericError,
    };
  }
}

export async function updateUserAction(id: string, input: UpdateUserInput) {
  try {
    const validated = updateUserSchema.parse(input);
    
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    // Convert role name to roleId if role is being updated
    const updateData: Partial<UserDb> = {
      ...validated,
      updatedAt: new Date(),
    };

    // If role is being updated, convert to roleId
    if (validated.role) {
      updateData.roleId = getRoleId(validated.role);
      delete (updateData as any).role; // Remove role name, we only store roleId
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: TRANSLATIONS.errors.userNotFound };
    }

    // Fetch updated user and convert to UI format
    const updatedUserDb = await db.collection<UserDb>('users').findOne({ 
      _id: new ObjectId(id) 
    }) as UserDb | null;

    if (!updatedUserDb) {
      return { success: false, error: TRANSLATIONS.errors.userNotFoundAfterUpdate };
    }

    const user = userFromDb(updatedUserDb);
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      user: {
        ...userWithoutPassword,
        _id: updatedUserDb._id?.toString() || id,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    console.error('Update user error:', error);
    return {
      success: false,
      error: TRANSLATIONS.errors.genericError,
    };
  }
}

export async function deleteUserAction(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    const result = await db.collection('users').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return { success: false, error: TRANSLATIONS.errors.userNotFound };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    return {
      success: false,
      error: TRANSLATIONS.errors.genericError,
    };
  }
}

export async function listUsersAction(role?: UserRole) {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    
    // Convert role name to roleId for query if role is provided
    const query = role ? { roleId: getRoleId(role) } : {};
    const usersDb = await db.collection<UserDb>('users')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray() as UserDb[];

    // Convert all database users to UI format
    const users = usersDb.map(userDb => {
      const user = userFromDb(userDb);
      const { password: _, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        _id: userDb._id?.toString() || '',
      };
    });

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error('List users error:', error);
    return {
      success: false,
      error: TRANSLATIONS.errors.genericError,
    };
  }
}

