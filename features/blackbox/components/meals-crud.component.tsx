'use client';

import { useState } from 'react';
import { Meal } from '@/features/core/types/meal.types';
import { EntityCrud } from './entity-crud.component';
import {
  listMealsAction,
  createMealAction,
  updateMealAction,
  deleteMealAction,
} from '@/features/core/server-actions/meals/meals-actions';

export function MealsCrud() {
  const [searchTerm, setSearchTerm] = useState('');

  const renderTable = (meals: Meal[], onEdit: (meal: Meal) => void, onDelete: (id: string) => void) => {
    const filteredMeals = meals.filter(meal =>
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.mealType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protein</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carbs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMeals.map((meal) => (
              <tr key={meal._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{meal.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{meal.mealType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.calories}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.protein}g</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.carbs}g</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.fats}g</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(meal)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(meal._id)}
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

  const renderForm = (meal: Meal | null, onSubmit: (data: any) => void, onCancel: () => void) => {
    const [formData, setFormData] = useState({
      name: meal?.name || '',
      description: meal?.description || '',
      calories: meal?.calories || 0,
      protein: meal?.protein || 0,
      carbs: meal?.carbs || 0,
      fats: meal?.fats || 0,
      mealType: meal?.mealType || 'breakfast',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
          <select
            value={formData.mealType}
            onChange={(e) => setFormData({ ...formData, mealType: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
            <input
              type="number"
              required
              min="0"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.protein}
              onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.carbs}
              onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.fats}
              onChange={(e) => setFormData({ ...formData, fats: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
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
            {meal ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <EntityCrud<Meal>
      entityName="Meal"
      entityNamePlural="meals"
      queryKey={['meals']}
      listAction={listMealsAction}
      createAction={createMealAction}
      updateAction={updateMealAction}
      deleteAction={deleteMealAction}
      renderTable={renderTable}
      renderForm={renderForm}
      getItemId={(meal) => meal._id}
      getItemDisplayName={(meal) => meal.name}
    />
  );
}

