import { RoleName, ROLE_NAMES, RoleId } from '../constants/roles.constants';
import { ThemeVariant, ThemeConfig } from './theme.types';
import { customerBaseTheme } from './base/customer.theme';
import { trainerBaseTheme } from './base/trainer.theme';
import { adminBaseTheme } from './base/admin.theme';
import { masterBaseTheme } from './base/master.theme';

type ThemeKey = `${RoleName}-${ThemeVariant}`;

const themeRegistry: Record<ThemeKey, ThemeConfig> = {
  // Customer themes
  [`${ROLE_NAMES[RoleId.CUSTOMER]}-default`]: customerBaseTheme,
  [`${ROLE_NAMES[RoleId.CUSTOMER]}-light`]: customerBaseTheme, // Can be customized later
  [`${ROLE_NAMES[RoleId.CUSTOMER]}-dark`]: customerBaseTheme, // Can be customized later
  [`${ROLE_NAMES[RoleId.CUSTOMER]}-halloween`]: customerBaseTheme, // Can be customized later

  // Trainer themes
  [`${ROLE_NAMES[RoleId.TRAINER]}-default`]: trainerBaseTheme,
  [`${ROLE_NAMES[RoleId.TRAINER]}-light`]: trainerBaseTheme, // Can be customized later
  [`${ROLE_NAMES[RoleId.TRAINER]}-dark`]: trainerBaseTheme, // Can be customized later
  [`${ROLE_NAMES[RoleId.TRAINER]}-halloween`]: trainerBaseTheme, // Can be customized later

  // Admin themes
  [`${ROLE_NAMES[RoleId.ADMIN]}-default`]: adminBaseTheme,
  [`${ROLE_NAMES[RoleId.ADMIN]}-light`]: adminBaseTheme, // Can be customized later
  [`${ROLE_NAMES[RoleId.ADMIN]}-dark`]: adminBaseTheme, // Can be customized later
  [`${ROLE_NAMES[RoleId.ADMIN]}-halloween`]: adminBaseTheme, // Can be customized later

  // Master themes (uses admin as base)
  [`${ROLE_NAMES[RoleId.MASTER]}-default`]: masterBaseTheme,
  [`${ROLE_NAMES[RoleId.MASTER]}-light`]: masterBaseTheme,
  [`${ROLE_NAMES[RoleId.MASTER]}-dark`]: masterBaseTheme,
  [`${ROLE_NAMES[RoleId.MASTER]}-halloween`]: masterBaseTheme,
};

/**
 * Get theme configuration for a specific role and variant
 * @param role - User role (customer, trainer, admin, master)
 * @param variant - Theme variant (default, light, dark, halloween)
 * @returns Theme configuration object
 */
export function getTheme(role: RoleName, variant: ThemeVariant = 'default'): ThemeConfig {
  const key: ThemeKey = `${role}-${variant}`;
  const theme = themeRegistry[key];
  
  // Fallback to default variant if specific variant doesn't exist
  if (!theme) {
    const defaultKey: ThemeKey = `${role}-default`;
    return themeRegistry[defaultKey] || customerBaseTheme;
  }
  
  return theme;
}

/**
 * Get all available themes for a role
 */
export function getThemesForRole(role: RoleName): Record<ThemeVariant, ThemeConfig> {
  return {
    default: getTheme(role, 'default'),
    light: getTheme(role, 'light'),
    dark: getTheme(role, 'dark'),
    halloween: getTheme(role, 'halloween'),
  };
}

