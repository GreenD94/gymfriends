'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface EntityCrudProps<T> {
  entityName: string;
  entityNamePlural: string;
  queryKey: string[];
  listAction: () => Promise<{ success: boolean; [key: string]: T[] | boolean | string }>;
  getAction?: (id: string) => Promise<{ success: boolean; [key: string]: T | boolean | string }>;
  createAction: (input: any) => Promise<{ success: boolean; [key: string]: T | boolean | string }>;
  updateAction: (id: string, input: any) => Promise<{ success: boolean; [key: string]: T | boolean | string }>;
  deleteAction: (id: string) => Promise<{ success: boolean; [key: string]: boolean | string }>;
  renderTable: (items: T[], onEdit: (item: T) => void, onDelete: (id: string) => void) => React.ReactNode;
  renderForm: (item: T | null, onSubmit: (data: any) => void, onCancel: () => void) => React.ReactNode;
  getItemId: (item: T) => string;
  getItemDisplayName: (item: T) => string;
}

/**
 * Generic CRUD component for any entity
 * Provides list, create, update, delete operations with React Query
 */
export function EntityCrud<T extends { _id: string }>({
  entityName,
  entityNamePlural,
  queryKey,
  listAction,
  getAction,
  createAction,
  updateAction,
  deleteAction,
  renderTable,
  renderForm,
  getItemId,
  getItemDisplayName,
}: EntityCrudProps<T>) {
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch list
  const { data: listResult, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await listAction();
      if (!result.success) {
        throw new Error(result.error || `Failed to fetch ${entityNamePlural}`);
      }
      return result;
    },
  });

  const items = (listResult?.[entityNamePlural] as T[]) || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setIsFormOpen(false);
      setEditingItem(null);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setIsFormOpen(false);
      setEditingItem(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete this ${entityName}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingItem) {
      updateMutation.mutate({ id: getItemId(editingItem), data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const isLoadingAny = isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const errorMessage = error?.message || createMutation.error?.message || updateMutation.error?.message || deleteMutation.error?.message || '';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{entityNamePlural}</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create {entityName}
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Loading State */}
      {isLoadingAny && (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      )}

      {/* Table */}
      {!isLoadingAny && items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No {entityNamePlural} found. Create one to get started.
        </div>
      )}

      {!isLoadingAny && items.length > 0 && (
        <div className="overflow-x-auto">
          {renderTable(items, handleEdit, handleDelete)}
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {editingItem ? `Edit ${entityName}` : `Create ${entityName}`}
              </h3>
              {renderForm(editingItem, handleSubmit, handleCancel)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

