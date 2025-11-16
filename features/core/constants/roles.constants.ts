import { TRANSLATIONS } from './translations.constants';

/**
 * Role IDs - Numeric identifiers for database storage
 * These IDs never change, even if role names do
 */
export enum RoleId {
  CUSTOMER = 1,
  TRAINER = 2,
  ADMIN = 3,
  MASTER = 4,
}

/**
 * Role names - Human-readable strings for UI
 */
export type RoleName = 'customer' | 'trainer' | 'admin' | 'master';

/**
 * Role mapping - ID to name
 */
export const ROLE_NAMES: Record<RoleId, RoleName> = {
  [RoleId.CUSTOMER]: 'customer',
  [RoleId.TRAINER]: 'trainer',
  [RoleId.ADMIN]: 'admin',
  [RoleId.MASTER]: 'master',
};

/**
 * Reverse mapping - Name to ID
 */
export const ROLE_IDS: Record<RoleName, RoleId> = {
  customer: RoleId.CUSTOMER,
  trainer: RoleId.TRAINER,
  admin: RoleId.ADMIN,
  master: RoleId.MASTER,
};

/**
 * Role display names - Uses translation system
 */
export const ROLE_DISPLAY_NAMES: Record<RoleId, string> = {
  [RoleId.CUSTOMER]: TRANSLATIONS.roles.customer,
  [RoleId.TRAINER]: TRANSLATIONS.roles.trainer,
  [RoleId.ADMIN]: TRANSLATIONS.roles.admin,
  [RoleId.MASTER]: TRANSLATIONS.roles.master,
};

/**
 * Role hierarchy for access control
 */
export const ROLE_HIERARCHY: Record<RoleId, number> = {
  [RoleId.CUSTOMER]: 1,
  [RoleId.TRAINER]: 2,
  [RoleId.ADMIN]: 3,
  [RoleId.MASTER]: 4,
};

/**
 * Get role name from ID
 */
export function getRoleName(roleId: RoleId): RoleName {
  return ROLE_NAMES[roleId];
}

/**
 * Get role ID from name
 */
export function getRoleId(roleName: RoleName): RoleId {
  return ROLE_IDS[roleName];
}

/**
 * Get display name from role ID
 */
export function getRoleDisplayName(roleId: RoleId): string {
  return ROLE_DISPLAY_NAMES[roleId];
}

/**
 * Check if user role can access target role
 */
export function canAccessRole(userRoleId: RoleId, targetRoleId: RoleId): boolean {
  if (userRoleId === RoleId.MASTER) return true;
  return ROLE_HIERARCHY[userRoleId] >= ROLE_HIERARCHY[targetRoleId];
}

/**
 * Check if role ID matches target role ID
 */
export function isRole(userRoleId: RoleId, targetRoleId: RoleId): boolean {
  return userRoleId === targetRoleId;
}

/**
 * Check if role is customer
 */
export function isCustomer(roleId: RoleId): boolean {
  return roleId === RoleId.CUSTOMER;
}

/**
 * Check if role is trainer
 */
export function isTrainer(roleId: RoleId): boolean {
  return roleId === RoleId.TRAINER;
}

/**
 * Check if role is admin
 */
export function isAdmin(roleId: RoleId): boolean {
  return roleId === RoleId.ADMIN;
}

/**
 * Check if role is master
 */
export function isMaster(roleId: RoleId): boolean {
  return roleId === RoleId.MASTER;
}

/**
 * Check if role is admin or master
 */
export function isAdminOrMaster(roleId: RoleId): boolean {
  return roleId === RoleId.ADMIN || roleId === RoleId.MASTER;
}

/**
 * Default role for new users and UI defaults
 */
export const DEFAULT_ROLE: RoleName = ROLE_NAMES[RoleId.CUSTOMER];

/**
 * Array of all role names for Zod schemas and iteration
 */
export const ALL_ROLE_NAMES: RoleName[] = Object.values(ROLE_NAMES);

/**
 * Roles that can be selected during registration (excludes master)
 */
export const REGISTERABLE_ROLES: RoleName[] = [
  ROLE_NAMES[RoleId.CUSTOMER],
  ROLE_NAMES[RoleId.TRAINER],
  ROLE_NAMES[RoleId.ADMIN],
];

/**
 * Legacy: Keep UserRole type for backward compatibility
 * @deprecated Use RoleName instead
 */
export type UserRole = RoleName;

/**
 * Legacy: Keep ROLES constant for backward compatibility
 * @deprecated Use ROLE_IDS or ROLE_NAMES instead
 */
export const ROLES: Record<RoleName, RoleName> = {
  customer: 'customer',
  trainer: 'trainer',
  admin: 'admin',
  master: 'master',
};
