import { ThemeConfig } from '../theme.types';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';

export const adminBaseTheme: ThemeConfig = {
  colors: {
    primary: '#9B77D9', // Purple from banner image
    primaryDark: '#6A3ABF', // Darker purple from banner
    primaryLight: '#B89AE8', // Lighter variant
    secondary: '#1E40AF', // Deep Blue
    secondaryDark: '#1E3A8A',
    secondaryLight: '#3B82F6',
    accent: '#9B77D9', // Match primary
    background: '#F5F3FF',
    surface: '#FFFFFF',
    text: '#1F2937',
    textMuted: '#6B7280',
    border: '#DDD6FE',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  classes: {
    bg: 'from-[#F5F3FF] to-[#E9E4FF]',
    primary: 'bg-[#9B77D9] hover:bg-[#6A3ABF]',
    primaryLight: 'bg-[#F5F3FF] text-[#9B77D9]',
    text: 'text-[#9B77D9] hover:text-[#6A3ABF]',
    titleColor: 'text-[#9B77D9]',
    border: 'border-[#9B77D9]',
    ring: 'ring-[#9B77D9]',
    focusRing: 'focus:border-[#9B77D9] focus:ring-[#B89AE8]',
  },
  content: {
    title: TRANSLATIONS.themes.admin.title,
    subtitle: TRANSLATIONS.themes.admin.subtitle,
  },
  cssVariables: {
    '--primary': '#9B77D9',
    '--primary-dark': '#6A3ABF',
    '--primary-light': '#B89AE8',
    '--secondary': '#1E40AF',
    '--secondary-dark': '#1E3A8A',
    '--secondary-light': '#3B82F6',
    '--accent': '#9B77D9',
    '--background': '#F5F3FF',
    '--surface': '#FFFFFF',
    '--text': '#1F2937',
    '--text-muted': '#6B7280',
    '--border': '#DDD6FE',
    '--success': '#10B981',
    '--warning': '#F59E0B',
    '--error': '#EF4444',
  },
};

