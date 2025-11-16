'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/features/core/hooks/use-session.hook';
import {
  listMealTemplatesAction,
  listExerciseTemplatesAction,
} from '@/features/core/server-actions/templates/templates-actions';

export function TemplateList() {
  const { user } = useSession();
  const [mealTemplates, setMealTemplates] = useState<any[]>([]);
  const [exerciseTemplates, setExerciseTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'meal' | 'exercise'>('meal');

  useEffect(() => {
    if (user?.id) {
      loadTemplates();
    }
  }, [user]);

  const loadTemplates = async () => {
    try {
      const [mealResult, exerciseResult] = await Promise.all([
        listMealTemplatesAction(user?.id),
        listExerciseTemplatesAction(user?.id),
      ]);

      if (mealResult.success) {
        setMealTemplates(mealResult.templates);
      }

      if (exerciseResult.success) {
        setExerciseTemplates(exerciseResult.templates);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white shadow-sm">
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('meal')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'meal'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Meal Templates ({mealTemplates.length})
          </button>
          <button
            onClick={() => setActiveTab('exercise')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'exercise'
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Exercise Templates ({exerciseTemplates.length})
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'meal' ? (
          <div className="space-y-4">
            {mealTemplates.length === 0 ? (
              <p className="text-center text-gray-500">No meal templates found</p>
            ) : (
              mealTemplates.map((template) => (
                <div
                  key={template._id}
                  className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  {template.description && (
                    <p className="mt-1 text-sm text-gray-600">{template.description}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    {template.meals?.length || 0} meals
                  </p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {exerciseTemplates.length === 0 ? (
              <p className="text-center text-gray-500">No exercise templates found</p>
            ) : (
              exerciseTemplates.map((template) => (
                <div
                  key={template._id}
                  className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  {template.description && (
                    <p className="mt-1 text-sm text-gray-600">{template.description}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    {template.exercises?.length || 0} days
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

