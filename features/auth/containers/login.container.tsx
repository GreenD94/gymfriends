'use client';

import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RoleName, DEFAULT_ROLE } from '@/features/core/constants/roles.constants';
import { getDashboardUrlByName } from '@/features/core/config/role.config';
import { LoginForm } from '../components/login-form.component';
import { EMPTY_ERROR } from '../constants/auth.constants';
import { TRANSLATIONS } from '@/features/core/constants/translations.constants';

interface LoginContainerProps {
  role?: RoleName;
  defaultRedirect?: string;
}

export function LoginContainer({ role = DEFAULT_ROLE, defaultRedirect }: LoginContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get default redirect URL from centralized role config (using backward compatibility function)
  const defaultRedirectUrl = defaultRedirect || getDashboardUrlByName(role);
  const callbackUrl = searchParams.get('callbackUrl') || defaultRedirectUrl;

  // Email/Password login mutation
  const emailLoginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(TRANSLATIONS.errors.wrongPassword);
      }

      return result;
    },
    onSuccess: () => {
      // Get the user's actual role from the session
      // We'll redirect and let the middleware handle role validation
      router.push(callbackUrl);
      router.refresh();
    },
    onError: () => {
      // Error is handled by mutation.error
    },
  });

  // Google login mutation
  const googleLoginMutation = useMutation({
    mutationFn: async () => {
      await signIn('google', {
        callbackUrl,
      });
    },
    onError: () => {
      // Error is handled by mutation.error
    },
  });

  const handleEmailLogin = (email: string, password: string) => {
    emailLoginMutation.mutate({ email, password });
  };

  const handleGoogleLogin = () => {
    googleLoginMutation.mutate();
  };

  // Combine loading states
  const isLoading = emailLoginMutation.isPending || googleLoginMutation.isPending;
  
  // Get error message (prioritize email login error)
  const error = emailLoginMutation.error?.message || googleLoginMutation.error?.message || EMPTY_ERROR;

  return (
    <LoginForm
      onEmailLogin={handleEmailLogin}
      onGoogleLogin={handleGoogleLogin}
      error={error}
      isLoading={isLoading}
      role={role}
    />
  );
}

