'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExerciseTemplate } from '@/features/core/types/template.types';
import { Exercise } from '@/features/core/types/exercise.types';
import { EntityCrud } from './entity-crud.component';
import {
  listExerciseTemplatesAction,
  createExerciseTemplateAction,
  updateExerciseTemplateAction,
  deleteExerciseTemplateAction,
} from '@/features/core/server-actions/templates/templates-actions';
import { listExercisesAction } from '@/features/core/server-actions/exercises/exercises-actions';
import { listUsersAction } from '@/features/core/server-actions/users/users-actions';
import { User } from '@/features/core/types/user.types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function ExerciseTemplatesCrud() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch exercises and users for dropdowns
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

  const exercises = (exercisesResult?.exercises as Exercise[]) || [];
  const users = (usersResult?.users as User[]) || [];

  const renderTable = (templates: ExerciseTemplate[], onEdit: (template: ExerciseTemplate) => void, onDelete: (id: string) => void) => {
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTemplates.map((template) => (
              <tr key={template._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {template.exercises?.map(e => DAYS[e.day]).join(', ') || 'None'}
                </td>
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

  const renderForm = (template: ExerciseTemplate | null, onSubmit: (data: any) => void, onCancel: () => void) => {
    const [formData, setFormData] = useState({
      name: template?.name || '',
      description: template?.description || '',
      exercises: template?.exercises || [],
      createdBy: template?.createdBy || '',
    });
    const [selectedDay, setSelectedDay] = useState(0);
    const [selectedExerciseId, setSelectedExerciseId] = useState('');

    const handleAddExercise = () => {
      const exercise = exercises.find(e => e._id === selectedExerciseId);
      if (exercise) {
        const dayExercises = formData.exercises.find(e => e.day === selectedDay);
        const updatedExercises = [...formData.exercises];
        
        if (dayExercises) {
          const dayIndex = updatedExercises.findIndex(e => e.day === selectedDay);
          if (!updatedExercises[dayIndex].exercises.find((e: any) => e._id === exercise._id)) {
            updatedExercises[dayIndex].exercises.push(exercise);
          }
        } else {
          updatedExercises.push({ day: selectedDay, exercises: [exercise] });
        }
        
        setFormData({ ...formData, exercises: updatedExercises });
        setSelectedExerciseId('');
      }
    };

    const handleRemoveExercise = (day: number, exerciseId: string) => {
      const updatedExercises = formData.exercises.map(dayEx => {
        if (dayEx.day === day) {
          return {
            ...dayEx,
            exercises: dayEx.exercises.filter((e: any) => e._id !== exerciseId),
          };
        }
        return dayEx;
      }).filter(dayEx => dayEx.exercises.length > 0);
      
      setFormData({ ...formData, exercises: updatedExercises });
    };

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Exercises by Day</label>
          <div className="flex gap-2 mb-2">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {DAYS.map((day, index) => (
                <option key={index} value={index}>{day}</option>
              ))}
            </select>
            <select
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select exercise...</option>
              {exercises.map((exercise) => (
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
          <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
            {DAYS.map((day, dayIndex) => {
              const dayExercises = formData.exercises.find(e => e.day === dayIndex);
              if (!dayExercises || dayExercises.exercises.length === 0) return null;
              
              return (
                <div key={dayIndex} className="p-2 bg-gray-50 rounded">
                  <div className="font-medium text-sm mb-1">{day}:</div>
                  {dayExercises.exercises.map((exercise: any) => (
                    <div key={exercise._id} className="flex items-center justify-between text-sm ml-4">
                      <span>{exercise.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(dayIndex, exercise._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
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
    <EntityCrud<ExerciseTemplate>
      entityName="Exercise Template"
      entityNamePlural="templates"
      queryKey={['exerciseTemplates']}
      listAction={listExerciseTemplatesAction}
      createAction={createExerciseTemplateAction}
      updateAction={updateExerciseTemplateAction}
      deleteAction={deleteExerciseTemplateAction}
      renderTable={renderTable}
      renderForm={renderForm}
      getItemId={(template) => template._id}
      getItemDisplayName={(template) => template.name}
    />
  );
}

