'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DailyAssignment } from '@/features/core/types/daily-assignment.types';
import { Meal } from '@/features/core/types/meal.types';
import { Exercise } from '@/features/core/types/exercise.types';
import { EntityCrud } from './entity-crud.component';
import {
  listDailyAssignmentsAction,
  createDailyAssignmentAction,
  updateDailyAssignmentAction,
  deleteDailyAssignmentAction,
} from '@/features/core/server-actions/daily-assignments/daily-assignments-actions';
import { listMealsAction } from '@/features/core/server-actions/meals/meals-actions';
import { listExercisesAction } from '@/features/core/server-actions/exercises/exercises-actions';
import { listUsersAction } from '@/features/core/server-actions/users/users-actions';
import { User } from '@/features/core/types/user.types';

export function DailyAssignmentsCrud() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch meals, exercises, and users for dropdowns
  const { data: mealsResult } = useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      const result = await listMealsAction();
      if (!result.success) throw new Error(result.error || 'Failed to fetch meals');
      return result;
    },
  });

  const { data: exercisesResult } = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const result = await listExercisesAction();
      if (!result.success) throw new Error(result.error || 'Failed to fetch exercises');
      return result;
    },
  });

  const { data: usersResult } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const result = await listUsersAction();
      if (!result.success) throw new Error(result.error || 'Failed to fetch users');
      return result;
    },
  });

  const meals = (mealsResult?.meals as Meal[]) || [];
  const exercises = (exercisesResult?.exercises as Exercise[]) || [];
  const users = (usersResult?.users as User[]) || [];

  const renderTable = (assignments: DailyAssignment[], onEdit: (assignment: DailyAssignment) => void, onDelete: (id: string) => void) => {
    const filteredAssignments = assignments.filter(assignment => {
      const customer = users.find(u => u._id === assignment.customerId);
      return customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             customer?.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const getCustomerName = (userId: string) => {
      const user = users.find(u => u._id === userId);
      return user?.name || userId;
    };

    return (
      <div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meals</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercises</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAssignments.map((assignment) => (
              <tr key={assignment._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getCustomerName(assignment.customerId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(assignment.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{assignment.meals?.length || 0}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{assignment.exercises?.length || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(assignment)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(assignment._id)}
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

  const renderForm = (assignment: DailyAssignment | null, onSubmit: (data: any) => void, onCancel: () => void) => {
    const [formData, setFormData] = useState({
      customerId: assignment?.customerId || '',
      date: assignment?.date ? new Date(assignment.date).toISOString().split('T')[0] : '',
      meals: (assignment?.meals || []) as Meal[],
      exercises: (assignment?.exercises || []) as Exercise[],
      assignedBy: assignment?.assignedBy || '',
    });
    const [selectedMealId, setSelectedMealId] = useState('');
    const [selectedExerciseId, setSelectedExerciseId] = useState('');

    const handleAddMeal = () => {
      const meal = meals.find(m => m._id === selectedMealId);
      if (meal && !formData.meals.find(m => m._id === meal._id)) {
        setFormData({
          ...formData,
          meals: [...formData.meals, meal],
        });
        setSelectedMealId('');
      }
    };

    const handleRemoveMeal = (mealId: string) => {
      setFormData({
        ...formData,
        meals: formData.meals.filter(m => m._id !== mealId),
      });
    };

    const handleAddExercise = () => {
      const exercise = exercises.find(e => e._id === selectedExerciseId);
      if (exercise && !formData.exercises.find(e => e._id === exercise._id)) {
        setFormData({
          ...formData,
          exercises: [...formData.exercises, exercise],
        });
        setSelectedExerciseId('');
      }
    };

    const handleRemoveExercise = (exerciseId: string) => {
      setFormData({
        ...formData,
        exercises: formData.exercises.filter(e => e._id !== exerciseId),
      });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        ...formData,
        date: new Date(formData.date),
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
            {users.filter(u => u.role === 'customer').map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned By</label>
          <select
            required
            value={formData.assignedBy}
            onChange={(e) => setFormData({ ...formData, assignedBy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select trainer...</option>
            {users.filter(u => u.role === 'trainer' || u.role === 'master').map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meals</label>
          <div className="flex gap-2 mb-2">
            <select
              value={selectedMealId}
              onChange={(e) => setSelectedMealId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select meal to add...</option>
              {meals.filter(m => !formData.meals.find(fm => fm._id === m._id)).map((meal) => (
                <option key={meal._id} value={meal._id}>
                  {meal.name} ({meal.calories} cal)
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddMeal}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Add
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 mb-4">
            {formData.meals.map((meal) => (
              <div key={meal._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{meal.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMeal(meal._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exercises</label>
          <div className="flex gap-2 mb-2">
            <select
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select exercise to add...</option>
              {exercises.filter(e => !formData.exercises.find(fe => fe._id === e._id)).map((exercise) => (
                <option key={exercise._id} value={exercise._id}>
                  {exercise.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddExercise}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Add
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
            {formData.exercises.map((exercise) => (
              <div key={exercise._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{exercise.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveExercise(exercise._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
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
            {assignment ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <EntityCrud<DailyAssignment>
      entityName="Daily Assignment"
      entityNamePlural="assignments"
      queryKey={['dailyAssignments']}
      listAction={listDailyAssignmentsAction}
      createAction={createDailyAssignmentAction}
      updateAction={updateDailyAssignmentAction}
      deleteAction={deleteDailyAssignmentAction}
      renderTable={renderTable}
      renderForm={renderForm}
      getItemId={(assignment) => assignment._id}
      getItemDisplayName={(assignment) => `Assignment for ${new Date(assignment.date).toLocaleDateString()}`}
    />
  );
}

