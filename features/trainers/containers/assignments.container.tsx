'use client';

import { useState } from 'react';
import { AssignmentForm } from '../components/assignment-form.component';

export function AssignmentsContainer() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assign Plans</h1>
          <p className="mt-2 text-gray-600">
            Assign weekly meal and exercise plans to customers
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-700"
        >
          New Assignment
        </button>
      </div>

      {showForm ? (
        <AssignmentForm
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      ) : (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-gray-600">Click "New Assignment" to assign a plan to a customer</p>
        </div>
      )}
    </div>
  );
}

