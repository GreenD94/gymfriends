'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/features/core/hooks/use-session.hook';
import { listUsersAction } from '@/features/core/server-actions/users/users-actions';
import {
  listMealTemplatesAction,
  listExerciseTemplatesAction,
} from '@/features/core/server-actions/templates/templates-actions';
import { createWeeklyAssignmentsAction } from '@/features/core/server-actions/daily-assignments/daily-assignments-actions';

interface AssignmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignmentForm({ onClose, onSuccess }: AssignmentFormProps) {
  const { user } = useSession();
  const [customers, setCustomers] = useState<any[]>([]);
  const [mealTemplates, setMealTemplates] = useState<any[]>([]);
  const [exerciseTemplates, setExerciseTemplates] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedMealTemplate, setSelectedMealTemplate] = useState('');
  const [selectedExerciseTemplate, setSelectedExerciseTemplate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersResult, mealResult, exerciseResult] = await Promise.all([
        listUsersAction('customer'),
        listMealTemplatesAction(user?.id),
        listExerciseTemplatesAction(user?.id),
      ]);

      if (customersResult.success) {
        setCustomers(customersResult.users);
      }
      if (mealResult.success) {
        setMealTemplates(mealResult.templates);
      }
      if (exerciseResult.success) {
        setExerciseTemplates(exerciseResult.templates);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedCustomer || !startDate) return;

    setLoading(true);
    try {
      const mealTemplate = mealTemplates.find((t) => t._id === selectedMealTemplate);
      const exerciseTemplate = exerciseTemplates.find((t) => t._id === selectedExerciseTemplate);

      const meals = mealTemplate
        ? Array.from({ length: 7 }, (_, i) => ({
            day: i,
            meals: mealTemplate.meals || [],
          }))
        : [];

      const exercises = exerciseTemplate
        ? exerciseTemplate.exercises || []
        : Array.from({ length: 7 }, (_, i) => ({
            day: i,
            exercises: [],
          }));

      const result = await createWeeklyAssignmentsAction({
        customerId: selectedCustomer,
        startDate: new Date(startDate),
        meals,
        exercises,
        assignedBy: user.id,
      });

      if (result.success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Assign Weekly Plan</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer</label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Week Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meal Template (Optional)</label>
          <select
            value={selectedMealTemplate}
            onChange={(e) => setSelectedMealTemplate(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          >
            <option value="">None</option>
            {mealTemplates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Exercise Template (Optional)
          </label>
          <select
            value={selectedExerciseTemplate}
            onChange={(e) => setSelectedExerciseTemplate(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          >
            <option value="">None</option>
            {exerciseTemplates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Assigning...' : 'Assign Plan'}
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

