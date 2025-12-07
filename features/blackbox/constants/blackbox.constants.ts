import { TabId } from '../types/blackbox.types';

/**
 * Blackbox tabs configuration
 */
export const BLACKBOX_TABS: { id: TabId; label: string }[] = [
  { id: 'diagram', label: 'Database Diagram' },
  { id: 'users', label: 'Users' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'meals', label: 'Meals' },
  { id: 'exercises', label: 'Exercises' },
  { id: 'meal-templates', label: 'Meal Templates' },
  { id: 'exercise-templates', label: 'Exercise Templates' },
  { id: 'daily-assignments', label: 'Daily Assignments' },
];

/**
 * Pagination constants
 */
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

