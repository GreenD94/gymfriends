'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Subscription } from '@/features/core/types/subscription.types';
import { EntityCrud } from './entity-crud.component';
import {
  listSubscriptionsAction,
  createSubscriptionAction,
  updateSubscriptionAction,
  deleteSubscriptionAction,
} from '@/features/core/server-actions/subscriptions/subscriptions-actions';
import { listUsersAction } from '@/features/core/server-actions/users/users-actions';
import { User } from '@/features/core/types/user.types';

export function SubscriptionsCrud() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users for dropdowns
  const { data: usersResult } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const result = await listUsersAction();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch users');
      }
      return result;
    },
  });

  const users = (usersResult?.users as User[]) || [];

  const renderTable = (subscriptions: Subscription[], onEdit: (sub: Subscription) => void, onDelete: (id: string) => void) => {
    const filteredSubs = subscriptions.filter(sub =>
      sub.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getUserName = (userId: string) => {
      const user = users.find(u => u._id === userId);
      return user?.name || userId;
    };

    return (
      <div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubs.map((sub) => (
              <tr key={sub._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.planName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getUserName(sub.customerId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    sub.status === 'active' ? 'bg-green-100 text-green-800' :
                    sub.status === 'expired' ? 'bg-red-100 text-red-800' :
                    sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sub.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sub.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(sub)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(sub._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderForm = (subscription: Subscription | null, onSubmit: (data: any) => void, onCancel: () => void) => {
    const [formData, setFormData] = useState({
      customerId: subscription?.customerId || '',
      planName: subscription?.planName || '',
      startDate: subscription?.startDate ? new Date(subscription.startDate).toISOString().split('T')[0] : '',
      endDate: subscription?.endDate ? new Date(subscription.endDate).toISOString().split('T')[0] : '',
      status: subscription?.status || 'pending',
      paymentScreenshot: subscription?.paymentScreenshot || '',
      assignedBy: subscription?.assignedBy || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <select
            required
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select customer...</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
          <input
            type="text"
            required
            value={formData.planName}
            onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned By</label>
          <select
            required
            value={formData.assignedBy}
            onChange={(e) => setFormData({ ...formData, assignedBy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select admin...</option>
            {users.filter(u => u.role === 'admin' || u.role === 'master').map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Screenshot (URL)</label>
          <input
            type="text"
            value={formData.paymentScreenshot}
            onChange={(e) => setFormData({ ...formData, paymentScreenshot: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {subscription ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <EntityCrud<Subscription>
      entityName="Subscription"
      entityNamePlural="subscriptions"
      queryKey={['subscriptions']}
      listAction={listSubscriptionsAction}
      createAction={createSubscriptionAction}
      updateAction={updateSubscriptionAction}
      deleteAction={deleteSubscriptionAction}
      renderTable={renderTable}
      renderForm={renderForm}
      getItemId={(sub) => sub._id}
      getItemDisplayName={(sub) => sub.planName}
    />
  );
}

