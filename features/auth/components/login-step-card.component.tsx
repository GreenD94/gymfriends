import { ReactNode } from 'react';
import { LoginStep, LOGIN_STEPS } from '../constants/login.constants';

interface LoginStepCardProps {
  step: LoginStep;
  currentStep: LoginStep;
  children: ReactNode;
}

/**
 * Animated card wrapper for login steps
 * Handles slide-in/slide-out animations between email and password steps
 */
export function LoginStepCard({ step, currentStep, children }: LoginStepCardProps) {
  const isVisible = step === currentStep;

  return (
    <div
      className={`absolute top-0 left-0 w-full transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-x-0 z-10'
          : 'opacity-0 -translate-x-full z-0 pointer-events-none invisible'
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

