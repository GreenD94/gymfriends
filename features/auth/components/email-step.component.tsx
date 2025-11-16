import { ThemeConfig } from '@/features/core/themes/theme.types';
import { t } from '@/features/core/constants/translations.constants';

interface EmailStepProps {
  email: string;
  emailError: string;
  isEmailValid: boolean;
  isLoading: boolean;
  theme: ThemeConfig;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isVisible?: boolean; // Optional now since card handles visibility
}

export function EmailStep({
  email,
  emailError,
  isEmailValid,
  isLoading,
  theme,
  onEmailChange,
  onSubmit,
  isVisible = true,
}: EmailStepProps) {
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
            id="email"
            type="email"
            value={email}
            onChange={onEmailChange}
            autoFocus
            autoComplete="email"
            className={`w-full rounded-lg border-2 px-4 py-3 text-base transition-all focus:outline-none focus:ring-2 ${
              emailError
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100 shake-animation'
                : `border-gray-300 focus:border-gray-400 ${theme.classes.focusRing}`
            }`}
            placeholder={t('forms.enterYourEmail')}
          />
        </div>

        <button
          type="submit"
          disabled={!isEmailValid || isLoading}
          className={`w-full rounded-lg ${theme.classes.primary} px-4 py-3 text-base font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg`}
        >
          {t('auth.next')}
        </button>
      </form>
    </>
  );
}

