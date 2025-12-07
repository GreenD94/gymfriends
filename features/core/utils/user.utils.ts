import { UserDb, User, UserDocument } from '@/features/core/types/user.types';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';
import { getDatabase } from './database.utils';
import { userFromDb } from './role.utils';
import { removePasswordFromUser } from './password.utils';

export type UserWithoutPassword = Omit<User, 'password'>;

export async function checkUserExistsByEmail(email: string): Promise<boolean> {
  const db = await getDatabase();
  const existingUser = await db.collection('users').findOne({ email });
  return !!existingUser;
}

export async function getUserByEmailOrFail(email: string): Promise<UserDb> {
  const db = await getDatabase();
  const userDb = await db.collection<UserDb>('users').findOne({ email }) as UserDb | null;
  
  if (!userDb) {
    throw new Error(TRANSLATIONS.errors.userNotFound);
  }
  
  return userDb;
}

export function convertUserToResponse(userDb: UserDocument | UserDb): UserWithoutPassword {
  const user = userFromDb(userDb);
  return removePasswordFromUser(user);
}

export function convertUsersToResponse(usersDb: (UserDocument | UserDb)[]): UserWithoutPassword[] {
  return usersDb.map(convertUserToResponse);
}

