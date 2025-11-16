'use client';

import { useEffect, useState } from 'react';
import { listUsersAction } from '@/features/core/server-actions/users/users-actions';
import { CustomerList } from '../components/customer-list.component';

export function CustomersContainer() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const result = await listUsersAction('customer');
      if (result.success) {
        setCustomers(result.users);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="mt-2 text-gray-600">Manage your customer list</p>
      </div>

      <CustomerList customers={customers} onRefresh={loadCustomers} />
    </div>
  );
}

