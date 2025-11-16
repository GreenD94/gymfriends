import { ThemeConfig } from '@/features/core/themes/theme.types';
import { t } from '@/features/core/constants/translations.constants';

interface PasswordStepProps {
  email: string;
  password: string;
  isLoading: boolean;
  theme: ThemeConfig;
  error?: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isVisible?: boolean; // Optional now since card handles visibility
}

export function PasswordStep({
  email,
  password,
  isLoading,
  theme,
  error,
  onPasswordChange,
  onBack,
  onSubmit,
  isVisible = true,
}: PasswordStepProps) {
  return (
    <>
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={onPasswordChange}
            autoFocus
            autoComplete="current-password"
            className={`w-full rounded-lg border-2 px-4 py-3 text-base transition-all focus:outline-none focus:ring-2 ${
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100 shake-animation'
                : `border-gray-300 focus:border-gray-400 ${theme.classes.focusRing}`
            }`}
            placeholder={t('forms.enterYourPassword')}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Back Arrow Icon */}
          <button
            type="button"
            onClick={onBack}
            className={`flex items-center justify-center w-10 h-10 rounded-lg ${theme.classes.primaryLight} cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95 hover:bg-opacity-90`}
            aria-label={t('auth.back')}
          >
            <svg 
              className="h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: theme.colors.primary }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>

          {/* Sign in Button */}
          <button
            type="submit"
            disabled={!password.trim() || isLoading}
            className={`flex-1 rounded-lg ${theme.classes.primary} px-4 py-3 text-base font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t('auth.signingIn')}
              </>
            ) : (
              t('auth.signIn')
            )}
          </button>
        </div>
      </form>
    </>
  );
}

