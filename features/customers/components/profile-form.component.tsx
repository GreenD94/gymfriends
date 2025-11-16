'use client';

import { useForm } from 'react-hook-form';

interface ProfileFormProps {
  user: any;
  onUpdate: (data: { phone?: string; instagram?: string }) => void;
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      instagram: user?.instagram || '',
    },
  });

  const onSubmit = (data: any) => {
    onUpdate({
      phone: data.phone,
      instagram: data.instagram,
    });
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={user?.name || ''}
            disabled
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="+1234567890"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
            Instagram
          </label>
          <input
            {...register('instagram')}
            type="text"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="@username"
          />
          {errors.instagram && (
            <p className="mt-1 text-sm text-red-600">{errors.instagram.message as string}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

