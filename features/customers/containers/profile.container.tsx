'use client';

import { useSession } from '@/features/core/hooks/use-session.hook';
import { useUsersList, useUsersMutations } from '@/features/core/hooks/use-users.hook';
import { ProfileForm } from '../components/profile-form.component';

export function ProfileContainer() {
  const { user } = useSession();
  
  // Fetch single user using listUsersAction with userId filter
  const { users, isLoading } = useUsersList({
    userId: user?.id,
    queryKeyPrefix: 'profile-user',
  });
  
  // Get mutations without triggering list fetch
  const { updateMutation } = useUsersMutations('profile-user');

  const userData = users && users.length > 0 ? users[0] : null;

  const handleUpdate = async (data: { phone?: string; instagram?: string }) => {
    if (!user?.id) return;

    updateMutation.mutate(
      { id: user.id, data },
      {
        onSuccess: () => {
          alert('Profile updated successfully!');
        },
        onError: () => {
          alert('Failed to update profile');
        },
      }
    );
  };

  if (isLoading) {
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

