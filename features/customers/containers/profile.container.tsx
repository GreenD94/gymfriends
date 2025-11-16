'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/features/core/hooks/use-session.hook';
import { getUserAction } from '@/features/core/server-actions/users/users-actions';
import { updateUserAction } from '@/features/core/server-actions/users/users-actions';
import { ProfileForm } from '../components/profile-form.component';

export function ProfileContainer() {
  const { user } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadUser();
    }
  }, [user]);

  const loadUser = async () => {
    if (!user?.id) return;

    try {
      const result = await getUserAction(user.id);
      if (result.success) {
        setUserData(result.user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: { phone?: string; instagram?: string }) => {
    if (!user?.id) return;

    try {
      const result = await updateUserAction(user.id, data);
      if (result.success) {
        setUserData(result.user);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Profile</h1>
      <ProfileForm user={userData} onUpdate={handleUpdate} />
    </div>
  );
}

