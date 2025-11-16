/**
 * Login flow steps
 */
export type LoginStep = 'email' | 'password';

/**
 * Login step constants
 */
export const LOGIN_STEPS = {
  EMAIL: 'email' as const,
  PASSWORD: 'password' as const,
} as const;

/**
 * Default login step
 */
export const DEFAULT_LOGIN_STEP: LoginStep = LOGIN_STEPS.EMAIL;

