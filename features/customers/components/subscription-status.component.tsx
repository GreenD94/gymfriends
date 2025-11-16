'use client';

interface SubscriptionStatusProps {
  subscription: any;
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  if (!subscription) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center">
        <p className="text-lg font-medium text-gray-900">No Active Subscription</p>
        <p className="mt-2 text-sm text-gray-600">
          Contact your trainer or admin to activate your subscription
        </p>
      </div>
    );
  }

  const isActive = subscription.status === 'active';
  const endDate = new Date(subscription.endDate);
  const daysRemaining = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`rounded-lg p-6 ${isActive ? 'bg-green-50' : 'bg-yellow-50'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{subscription.planName}</h3>
          <p className="mt-1 text-sm text-gray-600">
            Status: <span className="font-medium capitalize">{subscription.status}</span>
          </p>
          {isActive && (
            <p className="mt-1 text-sm text-gray-600">
              {daysRemaining > 0
                ? `${daysRemaining} days remaining`
                : 'Expires today'}
            </p>
          )}
        </div>
        <div className={`rounded-full px-4 py-2 ${isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          <span className="text-sm font-medium capitalize">{subscription.status}</span>
        </div>
      </div>
    </div>
  );
}

