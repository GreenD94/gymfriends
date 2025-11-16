import { RoleId, RoleName } from '../constants/roles.constants';

/**
 * UserRole type for backward compatibility
 * @deprecated Use RoleName directly
 */
export type UserRole = RoleName;

/**
 * User interface - Database format (stores roleId)
 */
export interface UserDb {
  _id?: string;
  email: string;
  password?: string; // Hashed, optional for OAuth users
  name: string;
  roleId: RoleId; // Stored in database as integer
  role?: RoleName; // Optional: computed from roleId for backward compatibility
  phone?: string;
  instagram?: string;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * User interface - UI format (includes role name for display)
 */
export interface User extends Omit<UserDb, 'role'> {
  role: RoleName; // Always present in UI, computed from roleId
}

/**
 * Create user input - accepts role name, converts to roleId for storage
 */
export interface CreateUserInput {
  email: string;
  password?: string;
  name: string;
  role: RoleName; // UI provides role name
  phone?: string;
  instagram?: string;
}

/**
 * Update user input
 */
export interface UpdateUserInput {
  name?: string;
  phone?: string;
  instagram?: string;
  role?: RoleName; // UI provides role name
}

