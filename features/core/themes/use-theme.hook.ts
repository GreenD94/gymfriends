'use client';

import { RoleName, DEFAULT_ROLE } from '../constants/roles.constants';
import { getTheme } from './theme-registry';
import { ThemeVariant, ThemeConfig } from './theme.types';

/**
 * Hook to get theme configuration based on role
 * @param role - User role (defaults to DEFAULT_ROLE if not provided)
 * @param variant - Theme variant (defaults to 'default')
 * @returns Theme configuration object
 */
export function useTheme(role?: RoleName, variant?: ThemeVariant): ThemeConfig {
  const effectiveRole = role || DEFAULT_ROLE;
  const effectiveVariant = variant || 'default';
  
  return getTheme(effectiveRole, effectiveVariant);
}

