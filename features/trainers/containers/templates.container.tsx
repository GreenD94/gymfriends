'use client';

import { useState } from 'react';
import { TemplateList } from '../components/template-list.component';
import { TemplateForm } from '../components/template-form.component';

export function TemplatesContainer() {
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<'meal' | 'exercise'>('meal');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <p className="mt-2 text-gray-600">Create and manage meal and exercise templates</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setSelectedType('meal');
              setShowForm(true);
            }}
            className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-700"
          >
            New Meal Template
          </button>
          <button
            onClick={() => {
              setSelectedType('exercise');
              setShowForm(true);
            }}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700"
          >
            New Exercise Template
          </button>
        </div>
      </div>

      {showForm ? (
        <TemplateForm
          type={selectedType}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            // Refresh list would happen here
          }}
        />
      ) : (
        <TemplateList />
      )}
    </div>
  );
}

