'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { RoleName, DEFAULT_ROLE } from '../constants/roles.constants';
import { ThemeVariant, ThemeConfig } from './theme.types';
import { getTheme } from './theme-registry';

interface ThemeContextType {
  theme: ThemeConfig;
  variant: ThemeVariant;
  setVariant: (variant: ThemeVariant) => void;
  role: RoleName;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  role?: RoleName;
  defaultVariant?: ThemeVariant;
}

/**
 * Theme provider component for managing theme state
 * Allows dynamic theme switching within a component tree
 */
export function ThemeProvider({ 
  children, 
  role = DEFAULT_ROLE,
  defaultVariant = 'default' 
}: ThemeProviderProps) {
  const [variant, setVariant] = useState<ThemeVariant>(defaultVariant);
  const theme = getTheme(role, variant);

  return (
    <ThemeContext.Provider value={{ theme, variant, setVariant, role }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * Must be used within a ThemeProvider
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
}

