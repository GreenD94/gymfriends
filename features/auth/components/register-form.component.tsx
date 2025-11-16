'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { REGISTERABLE_ROLES, DEFAULT_ROLE, getRoleId, getRoleDisplayName } from '@/features/core/constants/roles.constants';
import { t } from '@/features/core/constants/translations.constants';

const registerSchema = z.object({
  email: z.string().email(t('validation.invalidEmailFormat')),
  password: z.string().min(6, t('validation.passwordMinLength')),
  name: z.string().min(2, t('validation.nameMinLength')),
  role: z.enum(REGISTERABLE_ROLES as [string, ...string[]]),
  phone: z.string().optional(),
  instagram: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onRegister: (data: RegisterFormData) => void;
  error: string | null;
  isLoading: boolean;
}

export function RegisterForm({ onRegister, error, isLoading }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: DEFAULT_ROLE,
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    onRegister(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">{t('auth.createAccount')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('auth.signUpToGetStarted')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t('forms.fullName')}
              </label>
              <input
                {...register('name')}
                type="text"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder={t('forms.namePlaceholder')}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('forms.emailAddress')}
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder={t('forms.emailPlaceholder')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('forms.password')}
              </label>
              <input
                {...register('password')}
                type="password"
                autoComplete="new-password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder={t('forms.passwordPlaceholder')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                {t('forms.accountType')}
              </label>
              <select
                {...register('role')}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                {REGISTERABLE_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {getRoleDisplayName(getRoleId(role))}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                {t('forms.phoneNumberOptional')}
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder={t('forms.phonePlaceholder')}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                {t('forms.instagramOptional')}
              </label>
              <input
                {...register('instagram')}
                type="text"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder={t('forms.instagramPlaceholder')}
              />
              {errors.instagram && (
                <p className="mt-1 text-sm text-red-600">{errors.instagram.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          {t('auth.alreadyHaveAccount')}{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            {t('auth.signIn')}
          </a>
        </p>
      </div>
    </div>
  );
}

