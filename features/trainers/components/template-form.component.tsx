'use client';

import { useState } from 'react';
import { useSession } from '@/features/core/hooks/use-session.hook';
import {
  createMealTemplateAction,
  createExerciseTemplateAction,
} from '@/features/core/server-actions/templates/templates-actions';

interface TemplateFormProps {
  type: 'meal' | 'exercise';
  onClose: () => void;
  onSuccess: () => void;
}

export function TemplateForm({ type, onClose, onSuccess }: TemplateFormProps) {
  const { user } = useSession();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !name.trim()) return;

    setLoading(true);
    try {
      if (type === 'meal') {
        const result = await createMealTemplateAction({
          name,
          description,
          meals: [], // Would be populated from a meal selector
          createdBy: user.id,
        });
        if (result.success) {
          onSuccess();
        }
      } else {
        const result = await createExerciseTemplateAction({
          name,
          description,
          exercises: [], // Would be populated from an exercise selector
          createdBy: user.id,
        });
        if (result.success) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error creating template:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Create {type === 'meal' ? 'Meal' : 'Exercise'} Template
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            placeholder={`${type === 'meal' ? 'Meal' : 'Exercise'} template name`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            placeholder="Optional description"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Template'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

