'use client';

import { useEffect } from 'react';
import { useSession } from '@/features/core/hooks/use-session.hook';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getRoleId, isTrainer, isMaster } from '@/features/core/constants/roles.constants';
import { t } from '@/features/core/constants/translations.constants';

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role } = useSession();
  const pathname = usePathname();
  const isLoginPage = pathname === '/trainer/login';

  useEffect(() => {
    if (role && !isTrainer(getRoleId(role)) && !isMaster(getRoleId(role))) {
      return;
    }
    document.documentElement.setAttribute('data-theme', 'trainer');
  }, [role]);

  // Allow login page to render without user (guest access)
  if (!user && !isLoginPage) {
    return null;
  }

  // If on login page, render without nav
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/trainer" className="text-xl font-bold text-orange-600">
                {t('navigation.trainerDashboard')}
              </Link>
              <div className="hidden gap-4 md:flex">
                <Link
                  href="/trainer"
                  className="text-sm font-medium text-gray-700 hover:text-orange-600"
                >
                  {t('navigation.dashboard')}
                </Link>
                <Link
                  href="/trainer/customers"
                  className="text-sm font-medium text-gray-700 hover:text-orange-600"
                >
                  {t('navigation.customers')}
                </Link>
                <Link
                  href="/trainer/templates"
                  className="text-sm font-medium text-gray-700 hover:text-orange-600"
                >
                  {t('navigation.templates')}
                </Link>
                <Link
                  href="/trainer/assignments"
                  className="text-sm font-medium text-gray-700 hover:text-orange-600"
                >
                  {t('navigation.assignments')}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
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

