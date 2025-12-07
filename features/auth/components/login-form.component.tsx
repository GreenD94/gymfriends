'use client';

import { useState, useEffect } from 'react';
import { RoleName, isCustomer, isAdmin, getRoleId, DEFAULT_ROLE } from '@/features/core/constants/roles.constants';
import { useTheme } from '@/features/core/themes';
import { LOGIN_STEPS } from '../constants/login.constants';
import { useEmailValidation } from '../hooks/use-email-validation.hook';
import { useLoginSteps } from '../hooks/use-login-steps.hook';
import { LoginLayout } from './login-layout.component';
import { LoginHeader } from './login-header.component';
import { LoginFormContainer } from './login-form-container.component';
import { LoginStepCard } from './login-step-card.component';
import { EmailStep } from './email-step.component';
import { PasswordStep } from './password-step.component';
import { LoginDivider } from './login-divider.component';
import { GoogleLoginButton } from './google-login-button.component';
import { SignUpLink } from './sign-up-link.component';

interface LoginFormProps {
  onEmailLogin: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  error: string;
  isLoading: boolean;
  role?: RoleName;
}

/**
 * Main login form component
 * Orchestrates the login flow with email and password steps
 */
export function LoginForm({ 
  onEmailLogin, 
  onGoogleLogin, 
  error, 
  isLoading, 
  role = DEFAULT_ROLE 
}: LoginFormProps) {
  const theme = useTheme(role);
  const { step, goToEmailStep, goToPasswordStep } = useLoginSteps();
  const { 
    email, 
    emailError, 
    isEmailValid, 
    handleEmailChange, 
    validateAndGetError,
    setEmailError
  } = useEmailValidation();
  
  const [password, setPassword] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateAndGetError();
    
    if (!validationError && isEmailValid && email.trim()) {
      goToPasswordStep();
    } else {
      setEmailError(validationError);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
    goToEmailStep();
    setPassword('');
    setShowPasswordError(false);
  };

  // Reset on error
  useEffect(() => {
    if (error) {
      goToPasswordStep();
      setShowPasswordError(true);
    }
  }, [error, goToPasswordStep]);

  const isAdminRole = isAdmin(getRoleId(role));
  const isCustomerRole = isCustomer(getRoleId(role));

  return (
    <LoginLayout
      theme={theme}
      role={role}
      header={<LoginHeader theme={theme} />}
      formContent={
        <LoginFormContainer>
          {/* Email Step Card */}
          <LoginStepCard step={LOGIN_STEPS.EMAIL} currentStep={step}>
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

            {!isAdminRole && (
                  <>
                    <LoginDivider />
                    <GoogleLoginButton onClick={onGoogleLogin} disabled={isLoading} />
                  </>
                )}

            <SignUpLink theme={theme} show={isCustomerRole} />
          </LoginStepCard>

          {/* Password Step Card */}
          <LoginStepCard step={LOGIN_STEPS.PASSWORD} currentStep={step}>
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
          </LoginStepCard>
        </LoginFormContainer>
      }
    />
  );
}
