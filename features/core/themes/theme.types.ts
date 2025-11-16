export type ThemeVariant = 'default' | 'light' | 'dark' | 'halloween';

export interface ThemeConfig {
  // Colors (hex values)
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    secondaryDark: string;
    secondaryLight: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };

  // Tailwind classes (for components that need them)
  classes: {
    bg: string; // Background gradient classes
    primary: string; // Primary button classes
    primaryLight: string; // Light primary variant
    text: string; // Text color classes
    titleColor: string; // Title color class (e.g., text-blue-600)
    border: string; // Border color classes
    ring: string; // Focus ring classes
    focusRing: string; // Focus ring classes for inputs (e.g., focus:border-blue-500 focus:ring-blue-200)
  };

  // Content (titles, subtitles, etc.)
  content: {
    title: string;
    subtitle: string;
  };

  // CSS variables (for CSS-based theming)
  cssVariables: Record<string, string>;
}

