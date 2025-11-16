import { RoleId, RoleName, getRoleName, getRoleId } from '../constants/roles.constants';

/**
 * Validate role ID
 */
export function isValidRoleId(id: number): id is RoleId {
  return Object.values(RoleId).includes(id as RoleId);
}

/**
 * Validate role name
 */
export function isValidRoleName(name: string): name is RoleName {
  return ['customer', 'trainer', 'admin', 'master'].includes(name);
}

/**
 * Convert role name to ID for database storage
 */
export function roleNameToId(roleName: RoleName): RoleId {
  return getRoleId(roleName);
}

/**
 * Convert role ID to name for UI display
 */
export function roleIdToName(roleId: RoleId | number): RoleName {
  if (typeof roleId === 'number' && !isValidRoleId(roleId)) {
    throw new Error(`Invalid role ID: ${roleId}`);
  }
  return getRoleName(roleId as RoleId);
}

/**
 * Convert database user (with roleId) to UI user (with role name)
 */
export function userFromDb<T extends { roleId: number; [key: string]: any }>(
  dbUser: T
): T & { role: RoleName } {
  if (!isValidRoleId(dbUser.roleId)) {
    throw new Error(`Invalid roleId in database: ${dbUser.roleId}`);
  }
  return {
    ...dbUser,
    role: roleIdToName(dbUser.roleId),
  };
}

/**
 * Convert UI user input (with role name) to database format (with roleId)
 */
export function userToDb<T extends { role: RoleName; [key: string]: any }>(
  user: T
): Omit<T, 'role'> & { roleId: RoleId } {
  if (!isValidRoleName(user.role)) {
    throw new Error(`Invalid role name: ${user.role}`);
  }
  const { role, ...rest } = user;
  return {
    ...rest,
    roleId: roleNameToId(role),
  };
}

