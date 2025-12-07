'use client';

import { useState } from 'react';
import { Exercise } from '@/features/core/types/exercise.types';
import { EntityCrud } from './entity-crud.component';
import {
  listExercisesAction,
  createExerciseAction,
  updateExerciseAction,
  deleteExerciseAction,
} from '@/features/core/server-actions/exercises/exercises-actions';

export function ExercisesCrud() {
  const [searchTerm, setSearchTerm] = useState('');

  const renderTable = (exercises: Exercise[], onEdit: (exercise: Exercise) => void, onDelete: (id: string) => void) => {
    const filteredExercises = exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscleGroups.some(mg => mg.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
      <div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Muscle Groups</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sets</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reps</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExercises.map((exercise) => (
              <tr key={exercise._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exercise.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {exercise.muscleGroups.join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exercise.sets || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exercise.reps || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {exercise.duration ? `${exercise.duration} min` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(exercise)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(exercise._id)}
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

  const renderForm = (exercise: Exercise | null, onSubmit: (data: any) => void, onCancel: () => void) => {
    const [formData, setFormData] = useState({
      name: exercise?.name || '',
      description: exercise?.description || '',
      sets: exercise?.sets || undefined,
      reps: exercise?.reps || undefined,
      duration: exercise?.duration || undefined,
      restTime: exercise?.restTime || undefined,
      muscleGroups: exercise?.muscleGroups || [],
    });
    const [muscleGroupInput, setMuscleGroupInput] = useState('');

    const handleAddMuscleGroup = () => {
      if (muscleGroupInput.trim() && !formData.muscleGroups.includes(muscleGroupInput.trim())) {
        setFormData({
          ...formData,
          muscleGroups: [...formData.muscleGroups, muscleGroupInput.trim()],
        });
        setMuscleGroupInput('');
      }
    };

    const handleRemoveMuscleGroup = (mg: string) => {
      setFormData({
        ...formData,
        muscleGroups: formData.muscleGroups.filter(m => m !== mg),
      });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.muscleGroups.length === 0) {
        alert('At least one muscle group is required');
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Muscle Groups</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={muscleGroupInput}
              onChange={(e) => setMuscleGroupInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddMuscleGroup();
                }
              }}
              placeholder="Add muscle group..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddMuscleGroup}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.muscleGroups.map((mg) => (
              <span
                key={mg}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
              >
                {mg}
                <button
                  type="button"
                  onClick={() => handleRemoveMuscleGroup(mg)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sets</label>
            <input
              type="number"
              min="0"
              value={formData.sets || ''}
              onChange={(e) => setFormData({ ...formData, sets: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
            <input
              type="number"
              min="0"
              value={formData.reps || ''}
              onChange={(e) => setFormData({ ...formData, reps: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="number"
              min="0"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rest Time (seconds)</label>
            <input
              type="number"
              min="0"
              value={formData.restTime || ''}
              onChange={(e) => setFormData({ ...formData, restTime: e.target.value ? Number(e.target.value) : undefined })}
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
            {exercise ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <EntityCrud<Exercise>
      entityName="Exercise"
      entityNamePlural="exercises"
      queryKey={['exercises']}
      listAction={listExercisesAction}
      createAction={createExerciseAction}
      updateAction={updateExerciseAction}
      deleteAction={deleteExerciseAction}
      renderTable={renderTable}
      renderForm={renderForm}
      getItemId={(exercise) => exercise._id}
      getItemDisplayName={(exercise) => exercise.name}
    />
  );
}

