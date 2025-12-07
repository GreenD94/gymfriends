import { ReactNode } from 'react';
import { ThemeConfig } from '@/features/core/themes/theme.types';
import { RoleName } from '@/features/core/constants/roles.constants';
import { getLoginBannerByName } from '@/features/core/config/role.config';
import { LoginBanner } from './login-banner.component';

interface LoginLayoutProps {
  theme: ThemeConfig;
  role: RoleName;
  header: ReactNode;
  formContent: ReactNode;
}

/**
 * Main layout component for login page
 * Handles the two-column layout (form on left, banner on right)
 */
export function LoginLayout({ theme, role, header, formContent }: LoginLayoutProps) {
  return (
    <div className={`flex h-screen bg-gradient-to-br ${theme.classes.bg} overflow-hidden py-6 px-4`}>
      {/* Left side - Login Form */}
      <div className="relative flex w-full lg:w-1/2 items-center justify-center px-4 py-8 overflow-hidden">
        {/* Header at top - centered on mobile, left on desktop */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0 z-10">
          {header}
        </div>

        {/* Main Card Container */}
        {formContent}
      </div>

      {/* Right side - Banner Image */}
      <div className="card-enter hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
        <LoginBanner src={getLoginBannerByName(role)} alt="Login Banner" />
      </div>

      <LoginAnimations />
    </div>
  );
}

/**
 * Login animations styles
 * Extracted to separate component for better organization
 */
function LoginAnimations() {
  return (
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
  );
}

