import { RoleId, RoleName, getRoleId, getRoleName } from '../constants/roles.constants';

export interface RoleConfig {
  roleId: RoleId;
  dashboardUrl: string;
  loginUrl: string;
  allowedRoutes: string[];
  displayName: string;
  loginBanner: string; // Login banner image path
}

/**
 * Centralized role configuration
 * Single source of truth for all role-based routing and access control
 * Uses RoleId as key for type safety
 */
export const ROLE_CONFIG: Record<RoleId, RoleConfig> = {
  [RoleId.CUSTOMER]: {
    roleId: RoleId.CUSTOMER,
    dashboardUrl: '/',
    loginUrl: '/login',
    allowedRoutes: ['/'],
    displayName: 'Customer',
    loginBanner: '/login-customer-banner.png',
  },
  [RoleId.TRAINER]: {
    roleId: RoleId.TRAINER,
    dashboardUrl: '/trainer',
    loginUrl: '/trainer/login',
    allowedRoutes: ['/trainer'],
    displayName: 'Trainer',
    loginBanner: '/login-trainer-banner.png',
  },
  [RoleId.ADMIN]: {
    roleId: RoleId.ADMIN,
    dashboardUrl: '/admin',
    loginUrl: '/admin/login',
    allowedRoutes: ['/admin'],
    displayName: 'Admin',
    loginBanner: '/login-admin-banner.png',
  },
  [RoleId.MASTER]: {
    roleId: RoleId.MASTER,
    dashboardUrl: '/admin',
    loginUrl: '/admin/login',
    allowedRoutes: ['/', '/trainer', '/admin'],
    displayName: 'Master',
    loginBanner: '/login-admin-banner.png', // Uses admin banner
  },
};

/**
 * Get dashboard URL for a role ID
 */
export function getDashboardUrl(roleId: RoleId): string {
  return ROLE_CONFIG[roleId].dashboardUrl;
}

/**
 * Get login URL for a role ID
 */
export function getLoginUrl(roleId: RoleId): string {
  return ROLE_CONFIG[roleId].loginUrl;
}

/**
 * Get allowed routes for a role ID
 */
export function getAllowedRoutes(roleId: RoleId): string[] {
  return ROLE_CONFIG[roleId].allowedRoutes;
}

/**
 * Get role configuration object by ID
 */
export function getRoleConfig(roleId: RoleId): RoleConfig {
  return ROLE_CONFIG[roleId];
}

// Backward compatibility: Functions that accept role names
/**
 * Get dashboard URL for a role name (backward compatibility)
 */
export function getDashboardUrlByName(roleName: RoleName): string {
  return getDashboardUrl(getRoleId(roleName));
}

/**
 * Get login URL for a role name (backward compatibility)
 */
export function getLoginUrlByName(roleName: RoleName): string {
  return getLoginUrl(getRoleId(roleName));
}

/**
 * Get allowed routes for a role name (backward compatibility)
 */
export function getAllowedRoutesByName(roleName: RoleName): string[] {
  return getAllowedRoutes(getRoleId(roleName));
}

/**
 * Get login banner path for a role ID
 */
export function getLoginBanner(roleId: RoleId): string {
  return ROLE_CONFIG[roleId].loginBanner;
}

/**
 * Get login banner path for a role name (backward compatibility)
 */
export function getLoginBannerByName(roleName: RoleName): string {
  return getLoginBanner(getRoleId(roleName));
}

