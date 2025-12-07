import bcrypt from 'bcryptjs';

/**
 * Password hashing and comparison utilities
 * Centralized password operations for consistency and security
 */

const BCRYPT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * 
 * @param password - Plain text password to hash
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare a plain text password with a hashed password
 * 
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare against
 * @returns true if passwords match, false otherwise
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Remove password field from user object
 * Type-safe utility to exclude password from user responses
 * 
 * @param user - User object that may contain password
 * @returns User object without password field
 */
export function removePasswordFromUser<T extends { password?: string }>(
  user: T
): Omit<T, 'password'> {
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

