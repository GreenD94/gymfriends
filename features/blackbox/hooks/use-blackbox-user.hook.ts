'use client';

import { useState } from 'react';
import { useUsersList, useUsersMutations, UseUsersMutationsReturn } from '@/features/core/hooks/use-users.hook';
import { UserDb, CreateUserInput, UpdateUserInput } from '@/features/core/types/user.types';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE } from '../constants/blackbox.constants';

export interface UseBlackboxUserReturn {
  users: UserDb[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  error: string;
  formMode: 'create' | 'edit' | '';
  editingUserId: string;
  editingUser: UserDb | undefined;
  createMutation: UseUsersMutationsReturn['createMutation'];
  updateMutation: UseUsersMutationsReturn['updateMutation'];
  deleteMutation: UseUsersMutationsReturn['deleteMutation'];
  handlePageChange: (newPage: number) => void;
  handleCreate: () => void;
  handleEdit: (user: UserDb) => void;
  handleCancel: () => void;
  handleSubmit: (data: CreateUserInput | UpdateUserInput) => void;
  handleDelete: (id: string) => void;
}

export function useBlackboxUser(): UseBlackboxUserReturn {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [formMode, setFormMode] = useState<'create' | 'edit' | ''>('');
  const [editingUserId, setEditingUserId] = useState<string>('');

  const listQuery = useUsersList({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    queryKeyPrefix: 'blackbox-users',
  });

  const editingQuery = useUsersList({
    userId: editingUserId,
    queryKeyPrefix: 'blackbox-editing-user',
    enabled: formMode === 'edit' && !!editingUserId,
  });

  const mutations = useUsersMutations('blackbox-users');

  const users = listQuery.response.data;
  const total = listQuery.response.total;
  const pageSize = listQuery.response.pageSize;
  const editingUser = editingQuery.response.data[0] || undefined;

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleCreate = () => {
    setFormMode('create');
    setEditingUserId('');
  };
  const handleEdit = (user: UserDb) => {
    setFormMode('edit');
    setEditingUserId(user._id || '');
  };
  const handleCancel = () => {
    setFormMode('');
    setEditingUserId('');
  };

  const handleSubmit = (data: CreateUserInput | UpdateUserInput) => {
    if (formMode === 'edit' && editingUserId) {
      mutations.updateMutation.mutate(
        { id: editingUserId, data: data as UpdateUserInput },
        { onSuccess: handleCancel }
      );
    } else {
      mutations.createMutation.mutate(data as CreateUserInput, { onSuccess: handleCancel });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      mutations.deleteMutation.mutate(id, {
        onSuccess: () => {
          if (users.length === 1 && page > 1) {
            setPage(page - 1);
          }
        },
      });
    }
  };

  const error =
    listQuery.error?.message ||
    mutations.createMutation.error?.message ||
    mutations.updateMutation.error?.message ||
    mutations.deleteMutation.error?.message ||
    '';

  return {
    users,
    total,
    page,
    pageSize,
    isLoading: listQuery.isLoading || editingQuery.isLoading,
    error,
    formMode,
    editingUserId,
    editingUser,
    createMutation: mutations.createMutation,
    updateMutation: mutations.updateMutation,
    deleteMutation: mutations.deleteMutation,
    handlePageChange,
    handleCreate,
    handleEdit,
    handleCancel,
    handleSubmit,
    handleDelete,
  };
}

