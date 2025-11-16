'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/features/core/hooks/use-session.hook';
import { listUsersAction } from '@/features/core/server-actions/users/users-actions';
import { listSubscriptionsAction } from '@/features/core/server-actions/subscriptions/subscriptions-actions';
import Link from 'next/link';
import { t, tFormat } from '@/features/core/constants/translations.constants';

export function DashboardContainer() {
  const { user } = useSession();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeSubscriptions: 0,
    recentAssignments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const [customersResult, subscriptionsResult] = await Promise.all([
        listUsersAction('customer'),
        listSubscriptionsAction(),
      ]);

      if (customersResult.success) {
        setStats((prev) => ({
          ...prev,
          totalCustomers: customersResult.users.length,
        }));
      }

      if (subscriptionsResult.success) {
        const active = subscriptionsResult.subscriptions.filter(
          (s: any) => s.status === 'active'
        ).length;
        setStats((prev) => ({
          ...prev,
          activeSubscriptions: active,
        }));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">{t('dashboard.loading')}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{user?.name ? tFormat('dashboard.welcome', { name: user.name }) : t('dashboard.welcome').replace('{name}', '')}</h1>
        <p className="mt-2 text-gray-600">{t('dashboard.trainerManage')}</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.totalCustomers')}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.activeSubscriptions')}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.activeSubscriptions}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.recentAssignments')}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.recentAssignments}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/trainer/customers"
          className="block rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.manageCustomers')}</h3>
          <p className="mt-2 text-sm text-gray-600">
            {t('dashboard.manageCustomersDesc')}
          </p>
        </Link>

        <Link
          href="/trainer/templates"
          className="block rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.templates')}</h3>
          <p className="mt-2 text-sm text-gray-600">
            {t('dashboard.templatesDesc')}
          </p>
        </Link>

        <Link
          href="/trainer/assignments"
          className="block rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.assignPlans')}</h3>
          <p className="mt-2 text-sm text-gray-600">
            {t('dashboard.assignPlansDesc')}
          </p>
        </Link>
      </div>
    </div>
  );
}

