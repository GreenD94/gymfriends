/**
 * Global validation utilities
 * These functions can be used across the entire application
 */

/**
 * Validates email format using regex
 * @param email - Email string to validate
 * @returns true if email format is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

