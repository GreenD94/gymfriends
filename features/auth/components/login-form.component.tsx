'use client';

import { useState, useEffect } from 'react';
import { RoleName, isCustomer, isAdmin, getRoleId, DEFAULT_ROLE } from '@/features/core/constants/roles.constants';
import { t } from '@/features/core/constants/translations.constants';
import { useTheme } from '@/features/core/themes';
import { getLoginBannerByName } from '@/features/core/config/role.config';
import { LOGIN_STEPS, DEFAULT_LOGIN_STEP, LoginStep } from '../constants/login.constants';
import { LoginHeader } from './login-header.component';
import { EmailStep } from './email-step.component';
import { PasswordStep } from './password-step.component';
import { LoginDivider } from './login-divider.component';
import { GoogleLoginButton } from './google-login-button.component';
import { SignUpLink } from './sign-up-link.component';
import { LoginBanner } from './login-banner.component';

interface LoginFormProps {
  onEmailLogin: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  error: string;
  isLoading: boolean;
  role?: RoleName;
}

export function LoginForm({ onEmailLogin, onGoogleLogin, error, isLoading, role = DEFAULT_ROLE }: LoginFormProps) {
  const theme = useTheme(role);
  const [step, setStep] = useState<LoginStep>(DEFAULT_LOGIN_STEP);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  // Validate email format
  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (validateEmail(value)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmailValid && email.trim()) {
      setStep(LOGIN_STEPS.PASSWORD);
    } else if (!email.trim()) {
      setEmailError(t('validation.enterYourEmail'));
    } else {
      setEmailError(t('validation.invalidEmail'));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Clear error when user starts typing
    if (showPasswordError) {
      setShowPasswordError(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onEmailLogin(email, password);
    }
  };

  const handleBack = () => {
    setStep(LOGIN_STEPS.EMAIL);
    setPassword('');
    setShowPasswordError(false);
  };

  // Reset on error
  useEffect(() => {
    if (error) {
      setStep(LOGIN_STEPS.PASSWORD);
      setShowPasswordError(true);
    }
  }, [error]);

  return (
    <div className={`flex h-screen bg-gradient-to-br ${theme.classes.bg} overflow-hidden py-6 px-4 `}>
      {/* Left side - Login Form */}
      <div className="relative flex w-full lg:w-1/2 items-center justify-center px-4 py-8 overflow-hidden">
        {/* Header at top - centered on mobile, left on desktop */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0 z-10">
          <LoginHeader theme={theme} />
        </div>

        {/* Main Card Container - Relative positioning for absolute children */}
        <div className="relative w-full max-w-md card-enter -mt-[100px]">
          {/* Email Card */}
          <div
            className={`absolute top-0 left-0 w-full transition-all duration-500 ${
              step === LOGIN_STEPS.EMAIL
                ? 'opacity-100 translate-x-0 z-10'
                : 'opacity-0 -translate-x-full z-0 pointer-events-none invisible'
            }`}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="p-8">
                <EmailStep
                  email={email}
                  emailError={emailError}
                  isEmailValid={isEmailValid}
                  isLoading={isLoading}
                  theme={theme}
                  onEmailChange={handleEmailChange}
                  onSubmit={handleEmailSubmit}
                  isVisible={true}
                />

                {!isAdmin(getRoleId(role)) && (
                  <>
                    <LoginDivider />
                    <GoogleLoginButton onClick={onGoogleLogin} disabled={isLoading} />
                  </>
                )}

                <SignUpLink theme={theme} show={isCustomer(getRoleId(role))} />
              </div>
            </div>
          </div>

          {/* Password Card */}
          <div
            className={`absolute top-0 left-0 w-full transition-all duration-500 ${
              step === LOGIN_STEPS.PASSWORD
                ? 'opacity-100 translate-x-0 z-10'
                : 'opacity-0 translate-x-full z-0 pointer-events-none invisible'
            }`}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="p-8">
                <PasswordStep
                  email={email}
                  password={password}
                  isLoading={isLoading}
                  theme={theme}
                  error={showPasswordError ? error : ''}
                  onPasswordChange={handlePasswordChange}
                  onBack={handleBack}
                  onSubmit={handlePasswordSubmit}
                  isVisible={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Banner Image */}
      <div className="card-enter hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
        <LoginBanner src={getLoginBannerByName(role)} alt="Login Banner" />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDownFade {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .card-enter {
          animation: slideDownFade 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
