import { ThemeConfig } from '@/features/core/themes/theme.types';
import { AppLogo } from '@/features/core/components/app-logo.component';
import { AppTitle } from '@/features/core/components/app-title.component';

interface LoginHeaderProps {
  theme: ThemeConfig;
}

export function LoginHeader({ theme }: LoginHeaderProps) {
  return (
    <div className="mb-8 text-center ">
      {/* Logo and Title in a row */}
      <div className="mb-6 flex items-start justify-center  relative ">
        <div className="absolute top-1 -left-3">
          <AppLogo size="sm" />
        </div>
        <AppTitle theme={theme} size="xl" />
      </div>
    </div>
  );
}

