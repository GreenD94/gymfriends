'use client';

import { useState, useEffect } from 'react';
import { UserDb, CreateUserInput, UpdateUserInput } from '@/features/core/types/user.types';

export interface UserEditFormProps {
  mode: 'create' | 'edit';
  user?: UserDb;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string;
}

/**
 * User Edit Form Component
 * Form for creating and editing users
 */
export function UserEditForm({
  mode,
  user,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: UserEditFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    instagram: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        phone: user.phone || '',
        instagram: user.instagram || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        instagram: '',
      });
    }
    // Clear validation errors when mode changes
    setValidationErrors({
      name: '',
      email: '',
      password: '',
    });
  }, [mode, user]);

  const validateForm = (): boolean => {
    const errors = {
      name: '',
      email: '',
      password: '',
    };

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (mode === 'create' && !formData.password.trim()) {
      errors.password = 'Password is required for new users';
    } else if (formData.password.trim() && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return !errors.name && !errors.email && !errors.password;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (mode === 'create') {
      const createData: CreateUserInput = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim() || undefined,
        role: 'customer',
        phone: formData.phone.trim() || undefined,
        instagram: formData.instagram.trim() || undefined,
      };
      onSubmit(createData);
    } else {
      const updateData: UpdateUserInput = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        instagram: formData.instagram.trim() || undefined,
      };
      onSubmit(updateData);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error for this field when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          required
        />
        {validationErrors.name && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          disabled={mode === 'edit'}
          className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 ${
            mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          required
        />
        {validationErrors.email && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
        )}
        {mode === 'edit' && (
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password {mode === 'create' && <span className="text-red-500">*</span>}
          {mode === 'edit' && <span className="text-gray-400 text-xs">(leave blank to keep current)</span>}
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          required={mode === 'create'}
        />
        {validationErrors.password && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          placeholder="+1234567890"
        />
      </div>

      {/* Instagram */}
      <div>
        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
          Instagram
        </label>
        <input
          type="text"
          id="instagram"
          value={formData.instagram}
          onChange={(e) => handleChange('instagram', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          placeholder="@username"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
        </button>
      </div>
    </form>
  );
}

