import { ThemeConfig } from '../theme.types';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';

export const customerBaseTheme: ThemeConfig = {
  colors: {
    primary: '#3B82F6', // Blue
    primaryDark: '#2563EB',
    primaryLight: '#60A5FA',
    secondary: '#10B981', // Green
    secondaryDark: '#059669',
    secondaryLight: '#34D399',
    accent: '#06B6D4', // Cyan
    background: '#F0F9FF',
    surface: '#FFFFFF',
    text: '#1F2937',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  classes: {
    bg: 'from-blue-50 to-green-50',
    primary: 'bg-blue-600 hover:bg-blue-700',
    primaryLight: 'bg-blue-50 text-blue-600',
    text: 'text-blue-600 hover:text-blue-500',
    titleColor: 'text-blue-600',
    border: 'border-blue-500',
    ring: 'ring-blue-500',
    focusRing: 'focus:border-blue-500 focus:ring-blue-200',
  },
  content: {
    title: TRANSLATIONS.themes.customer.title,
    subtitle: TRANSLATIONS.themes.customer.subtitle,
  },
  cssVariables: {
    '--primary': '#3B82F6',
    '--primary-dark': '#2563EB',
    '--primary-light': '#60A5FA',
    '--secondary': '#10B981',
    '--secondary-dark': '#059669',
    '--secondary-light': '#34D399',
    '--accent': '#06B6D4',
    '--background': '#F0F9FF',
    '--surface': '#FFFFFF',
    '--text': '#1F2937',
    '--text-muted': '#6B7280',
    '--border': '#E5E7EB',
    '--success': '#10B981',
    '--warning': '#F59E0B',
    '--error': '#EF4444',
  },
};

