'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerAction } from '@/features/core/server-actions/auth/auth-actions';
import { RegisterForm } from '../components/register-form.component';
import { RoleName } from '@/features/core/constants/roles.constants';

export function RegisterContainer() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: {
    email: string;
    password: string;
    name: string;
    role: RoleName;
    phone?: string;
    instagram?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await registerAction(data);

      if (!result.success) {
        setError(result.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      // Redirect to login after successful registration
      router.push('/login?registered=true');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <RegisterForm
      onRegister={handleRegister}
      error={error}
      isLoading={isLoading}
    />
  );
}

