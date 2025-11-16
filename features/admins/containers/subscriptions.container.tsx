'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/features/core/hooks/use-session.hook';
import { listSubscriptionsAction } from '@/features/core/server-actions/subscriptions/subscriptions-actions';
import { SubscriptionList } from '../components/subscription-list.component';
import { SubscriptionForm } from '../components/subscription-form.component';

export function SubscriptionsContainer() {
  const { user } = useSession();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const result = await listSubscriptionsAction();
      if (result.success) {
        setSubscriptions(result.subscriptions);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <p className="mt-2 text-gray-600">Manage customer subscriptions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-purple-700"
        >
          New Subscription
        </button>
      </div>

      {showForm ? (
        <SubscriptionForm
          adminId={user?.id || ''}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadSubscriptions();
          }}
        />
      ) : (
        <SubscriptionList subscriptions={subscriptions} onRefresh={loadSubscriptions} />
      )}
    </div>
  );
}

