'use client';

import { useEffect } from 'react';
import { useSession } from '@/features/core/hooks/use-session.hook';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getRoleId, isCustomer, isMaster } from '@/features/core/constants/roles.constants';
import { t } from '@/features/core/constants/translations.constants';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role } = useSession();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (role && !isCustomer(getRoleId(role)) && !isMaster(getRoleId(role))) {
      // Redirect handled by middleware, but set theme here
      return;
    }
    document.documentElement.setAttribute('data-theme', 'customer');
  }, [role]);

  // Allow login/register pages to render without user (guest access)
  if (!user && !isLoginPage) {
    return null;
  }

  // If on login/register page, render without nav
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Gym Trainer App
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                {t('navigation.profile')}
              </Link>
              <span className="text-sm text-gray-500">{user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                {t('auth.signOut')}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

