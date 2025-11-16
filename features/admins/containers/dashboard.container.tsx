'use client';

import { useEffect, useState } from 'react';
import { listUsersAction } from '@/features/core/server-actions/users/users-actions';
import { listSubscriptionsAction } from '@/features/core/server-actions/subscriptions/subscriptions-actions';
import Link from 'next/link';
import { t } from '@/features/core/constants/translations.constants';

export function DashboardContainer() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalTrainers: 0,
    activeSubscriptions: 0,
    pendingSubscriptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [allUsersResult, customersResult, trainersResult, subscriptionsResult] =
        await Promise.all([
          listUsersAction(),
          listUsersAction('customer'),
          listUsersAction('trainer'),
          listSubscriptionsAction(),
        ]);

      if (allUsersResult.success) {
        setStats((prev) => ({
          ...prev,
          totalUsers: allUsersResult.users.length,
        }));
      }

      if (customersResult.success) {
        setStats((prev) => ({
          ...prev,
          totalCustomers: customersResult.users.length,
        }));
      }

      if (trainersResult.success) {
        setStats((prev) => ({
          ...prev,
          totalTrainers: trainersResult.users.length,
        }));
      }

      if (subscriptionsResult.success) {
        const active = subscriptionsResult.subscriptions.filter(
          (s: any) => s.status === 'active'
        ).length;
        const pending = subscriptionsResult.subscriptions.filter(
          (s: any) => s.status === 'pending'
        ).length;
        setStats((prev) => ({
          ...prev,
          activeSubscriptions: active,
          pendingSubscriptions: pending,
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
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.adminDashboard')}</h1>
        <p className="mt-2 text-gray-600">{t('dashboard.adminOverview')}</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">{t('dashboard.totalUsers')}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">{t('dashboard.totalCustomers')}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">{t('dashboard.totalTrainers')}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalTrainers}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">{t('dashboard.activeSubscriptions')}</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.activeSubscriptions}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">{t('dashboard.pendingSubscriptions')}</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.pendingSubscriptions}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/admin/users"
          className="block rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.manageUsers')}</h3>
          <p className="mt-2 text-sm text-gray-600">
            {t('dashboard.manageUsersDesc')}
          </p>
        </Link>

        <Link
          href="/admin/subscriptions"
          className="block rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.manageSubscriptions')}</h3>
          <p className="mt-2 text-sm text-gray-600">
            {t('dashboard.manageSubscriptionsDesc')}
          </p>
        </Link>
      </div>
    </div>
  );
}

