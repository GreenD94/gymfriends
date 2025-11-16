'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/features/core/hooks/use-session.hook';
import { getActiveSubscriptionAction } from '@/features/core/server-actions/subscriptions/subscriptions-actions';
import { getWeeklyAssignmentsAction } from '@/features/core/server-actions/daily-assignments/daily-assignments-actions';
import { WeeklyCalendar } from '../components/weekly-calendar.component';
import { SubscriptionStatus } from '../components/subscription-status.component';
import { t, tFormat } from '@/features/core/constants/translations.constants';

export function DashboardContainer() {
  const { user } = useSession();
  const [subscription, setSubscription] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;

    try {
      const [subResult, assignmentsResult] = await Promise.all([
        getActiveSubscriptionAction(user.id),
        getWeeklyAssignmentsAction(user.id, getWeekStart(currentWeek)),
      ]);

      if (subResult.success) {
        setSubscription(subResult.subscription);
      }

      if (assignmentsResult.success) {
        setAssignments(assignmentsResult.assignments);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
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
        <h1 className="text-3xl font-bold text-gray-900">{user?.name ? tFormat('dashboard.welcomeBack', { name: user.name }) : t('dashboard.welcomeBack').replace('{name}', '')}</h1>
        <p className="mt-2 text-gray-600">{t('dashboard.customerPlan')}</p>
      </div>

      <div className="mb-8">
        <SubscriptionStatus subscription={subscription} />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <WeeklyCalendar
          assignments={assignments}
          currentWeek={currentWeek}
          onWeekChange={setCurrentWeek}
        />
      </div>
    </div>
  );
}

