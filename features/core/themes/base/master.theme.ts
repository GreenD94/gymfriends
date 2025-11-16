import { ThemeConfig } from '../theme.types';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';

// Master theme uses admin theme as base (same colors)
export const masterBaseTheme: ThemeConfig = {
  colors: {
    primary: '#7C3AED', // Purple
    primaryDark: '#6D28D9',
    primaryLight: '#A78BFA',
    secondary: '#3B82F6', // Blue
    secondaryDark: '#2563EB',
    secondaryLight: '#60A5FA',
    accent: '#F97316', // Orange
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1F2937',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  classes: {
    bg: 'from-purple-50 to-blue-50',
    primary: 'bg-purple-600 hover:bg-purple-700',
    primaryLight: 'bg-purple-50 text-purple-600',
    text: 'text-purple-600 hover:text-purple-500',
    titleColor: 'text-purple-600',
    border: 'border-purple-500',
    ring: 'ring-purple-500',
    focusRing: 'focus:border-purple-500 focus:ring-purple-200',
  },
  content: {
    title: TRANSLATIONS.themes.master.title,
    subtitle: TRANSLATIONS.themes.master.subtitle,
  },
  cssVariables: {
    '--primary': '#7C3AED',
    '--primary-dark': '#6D28D9',
    '--primary-light': '#A78BFA',
    '--secondary': '#3B82F6',
    '--secondary-dark': '#2563EB',
    '--secondary-light': '#60A5FA',
    '--accent': '#F97316',
    '--background': '#FAFAFA',
    '--surface': '#FFFFFF',
    '--text': '#1F2937',
    '--text-muted': '#6B7280',
    '--border': '#E5E7EB',
    '--success': '#10B981',
    '--warning': '#F59E0B',
    '--error': '#EF4444',
  },
};

