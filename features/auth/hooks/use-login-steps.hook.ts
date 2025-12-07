import { useState, useCallback } from 'react';
import { LOGIN_STEPS, DEFAULT_LOGIN_STEP, LoginStep } from '../constants/login.constants';

interface UseLoginStepsReturn {
  step: LoginStep;
  setStep: (step: LoginStep) => void;
  goToEmailStep: () => void;
  goToPasswordStep: () => void;
  resetPassword: () => void;
}

/**
 * Custom hook for managing login flow steps
 * Handles step transitions and password reset
 */
export function useLoginSteps(): UseLoginStepsReturn {
  const [step, setStep] = useState<LoginStep>(DEFAULT_LOGIN_STEP);

  const goToEmailStep = useCallback(() => {
    setStep(LOGIN_STEPS.EMAIL);
  }, []);

  const goToPasswordStep = useCallback(() => {
    setStep(LOGIN_STEPS.PASSWORD);
  }, []);

  const resetPassword = useCallback(() => {
    // This is a placeholder - actual password reset is handled in the component
    // but we keep this for API consistency
  }, []);

  return {
    step,
    setStep,
    goToEmailStep,
    goToPasswordStep,
    resetPassword,
  };
}

