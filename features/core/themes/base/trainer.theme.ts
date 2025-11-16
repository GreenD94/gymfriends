import { ThemeConfig } from '../theme.types';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';

export const trainerBaseTheme: ThemeConfig = {
  colors: {
    primary: '#F97316', // Orange
    primaryDark: '#EA580C',
    primaryLight: '#FB923C',
    secondary: '#EF4444', // Red
    secondaryDark: '#DC2626',
    secondaryLight: '#F87171',
    accent: '#F59E0B', // Amber
    background: '#FFF7ED',
    surface: '#FFFFFF',
    text: '#1F2937',
    textMuted: '#6B7280',
    border: '#FED7AA',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  classes: {
    bg: 'from-orange-50 to-red-50',
    primary: 'bg-orange-600 hover:bg-orange-700',
    primaryLight: 'bg-orange-50 text-orange-600',
    text: 'text-orange-600 hover:text-orange-500',
    titleColor: 'text-orange-600',
    border: 'border-orange-500',
    ring: 'ring-orange-500',
    focusRing: 'focus:border-orange-500 focus:ring-orange-200',
  },
  content: {
    title: TRANSLATIONS.themes.trainer.title,
    subtitle: TRANSLATIONS.themes.trainer.subtitle,
  },
  cssVariables: {
    '--primary': '#F97316',
    '--primary-dark': '#EA580C',
    '--primary-light': '#FB923C',
    '--secondary': '#EF4444',
    '--secondary-dark': '#DC2626',
    '--secondary-light': '#F87171',
    '--accent': '#F59E0B',
    '--background': '#FFF7ED',
    '--surface': '#FFFFFF',
    '--text': '#1F2937',
    '--text-muted': '#6B7280',
    '--border': '#FED7AA',
    '--success': '#10B981',
    '--warning': '#F59E0B',
    '--error': '#EF4444',
  },
};

