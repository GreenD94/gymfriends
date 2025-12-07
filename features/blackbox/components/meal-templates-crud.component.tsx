'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MealTemplate } from '@/features/core/types/template.types';
import { Meal } from '@/features/core/types/meal.types';
import { EntityCrud } from './entity-crud.component';
import {
  listMealTemplatesAction,
  createMealTemplateAction,
  updateMealTemplateAction,
  deleteMealTemplateAction,
} from '@/features/core/server-actions/templates/templates-actions';
import { listMealsAction } from '@/features/core/server-actions/meals/meals-actions';
import { listUsersAction } from '@/features/core/server-actions/users/users-actions';
import { User } from '@/features/core/types/user.types';

export function MealTemplatesCrud() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch meals and users for dropdowns
  const { data: mealsResult } = useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      const result = await listMealsAction();
      if (!result.success) throw new Error(result.error || 'Failed to fetch meals');
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
  const users = (usersResult?.users as User[]) || [];

  const renderTable = (templates: MealTemplate[], onEdit: (template: MealTemplate) => void, onDelete: (id: string) => void) => {
    const filteredTemplates = templates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTrainerName = (userId: string) => {
      const user = users.find(u => u._id === userId);
      return user?.name || userId;
    };

    return (
      <div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meals Count</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTemplates.map((template) => (
              <tr key={template._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.meals?.length || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTrainerName(template.createdBy)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(template)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(template._id)}
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

  const renderForm = (template: MealTemplate | null, onSubmit: (data: any) => void, onCancel: () => void) => {
    const [formData, setFormData] = useState({
      name: template?.name || '',
      description: template?.description || '',
      meals: (template?.meals || []) as Meal[],
      createdBy: template?.createdBy || '',
    });
    const [selectedMealId, setSelectedMealId] = useState('');

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

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.meals.length === 0) {
        alert('At least one meal is required');
        return;
      }
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
          <select
            required
            value={formData.createdBy}
            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={!!template}
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
          <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
            {formData.meals.map((meal) => (
              <div key={meal._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{meal.name} - {meal.calories} cal</span>
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
            {template ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <EntityCrud<MealTemplate>
      entityName="Meal Template"
      entityNamePlural="templates"
      queryKey={['mealTemplates']}
      listAction={listMealTemplatesAction}
      createAction={createMealTemplateAction}
      updateAction={updateMealTemplateAction}
      deleteAction={deleteMealTemplateAction}
      renderTable={renderTable}
      renderForm={renderForm}
      getItemId={(template) => template._id}
      getItemDisplayName={(template) => template.name}
    />
  );
}

