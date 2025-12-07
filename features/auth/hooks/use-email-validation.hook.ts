import { useState, useCallback } from 'react';
import { validateEmail } from '@/features/core/utils/validation.utils';
import { t } from '@/features/core/constants/translations.constants';

interface UseEmailValidationReturn {
  email: string;
  emailError: string;
  isEmailValid: boolean;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateAndGetError: () => string;
  setEmailError: (error: string) => void;
}

/**
 * Custom hook for email validation logic
 * Manages email state, validation, and error messages
 */
export function useEmailValidation(): UseEmailValidationReturn {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
    
    if (value.trim() === '') {
      setIsEmailValid(false);
      return;
    }

    setIsEmailValid(validateEmail(value));
  }, [emailError]);

  const validateAndGetError = useCallback((): string => {
    if (!email.trim()) {
      return t('validation.enterYourEmail');
    }
    if (!validateEmail(email)) {
      return t('validation.invalidEmail');
    }
    return '';
  }, [email]);

  return {
    email,
    emailError,
    isEmailValid,
    handleEmailChange,
    validateAndGetError,
    setEmailError,
  };
}

