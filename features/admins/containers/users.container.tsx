'use client';

import { useEffect, useState } from 'react';
import { listUsersAction } from '@/features/core/server-actions/users/users-actions';
import { UserTable } from '../components/user-table.component';

export function UsersContainer() {
  const [users, setUsers] = useState<any[]>([]);
  const [filterRole, setFilterRole] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [filterRole]);

  const loadUsers = async () => {
    try {
      const result = await listUsersAction(
        filterRole ? (filterRole as any) : undefined
      );
      if (result.success) {
        setUsers(result.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-2 text-gray-600">Manage all users in the system</p>
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
        >
          <option value="">All Roles</option>
          <option value="customer">Customers</option>
          <option value="trainer">Trainers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <UserTable users={users} onRefresh={loadUsers} />
    </div>
  );
}

