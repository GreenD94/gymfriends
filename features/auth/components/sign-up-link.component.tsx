import { ThemeConfig } from '@/features/core/themes/theme.types';
import { t } from '@/features/core/constants/translations.constants';

interface SignUpLinkProps {
  theme: ThemeConfig;
  show: boolean;
}

export function SignUpLink({ theme, show }: SignUpLinkProps) {
  if (!show) return null;

  return (
    <p className="mt-6 text-center text-sm text-gray-600">
      {t('auth.dontHaveAccount')}{' '}
      <a href="/register" className={`font-medium ${theme.classes.text}`}>
        {t('auth.signUp')}
      </a>
    </p>
  );
}

