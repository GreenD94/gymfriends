'use client';

import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import {
  createUserAction,
  updateUserAction,
  deleteUserAction,
  listUsersAction,
} from '@/features/core/server-actions/users/users-actions';
import { UserDb, CreateUserInput, UpdateUserInput } from '@/features/core/types/user.types';
import { ApiResponse } from '@/features/core/utils/api-response.utils';

export interface UseUsersOptions {
  page?: number;
  pageSize?: number;
  role?: string;
  queryKeyPrefix?: string;
  userId?: string;
  enabled?: boolean;
}

type CreateUserResult = Awaited<ReturnType<typeof createUserAction>>;
type UpdateUserResult = Awaited<ReturnType<typeof updateUserAction>>;
type DeleteUserResult = Awaited<ReturnType<typeof deleteUserAction>>;
type ListUsersResult = Awaited<ReturnType<typeof listUsersAction>>;

const emptyApiResponse: ApiResponse<UserDb> = {
  message: '',
  code: 0,
  data: [],
  page: 0,
  pageSize: 0,
  total: 0,
};

export interface UseUsersListReturn {
  response: ApiResponse<UserDb>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseUsersMutationsReturn {
  createMutation: UseMutationResult<CreateUserResult, Error, CreateUserInput>;
  updateMutation: UseMutationResult<UpdateUserResult, Error, { id: string; data: UpdateUserInput }>;
  deleteMutation: UseMutationResult<DeleteUserResult, Error, string>;
}

export interface UseUsersReturn {
  response: ApiResponse<UserDb>;
  isLoadingList: boolean;
  listError: Error | null;
  createMutation: UseMutationResult<CreateUserResult, Error, CreateUserInput>;
  updateMutation: UseMutationResult<UpdateUserResult, Error, { id: string; data: UpdateUserInput }>;
  deleteMutation: UseMutationResult<DeleteUserResult, Error, string>;
  refetchList: () => void;
}

/**
 * Hook for fetching users list (query only)
 * Follows Single Responsibility Principle - only handles data fetching
 */
export function useUsersList(options: UseUsersOptions = {}): UseUsersListReturn {
  const {
    page,
    pageSize,
    role,
    queryKeyPrefix = 'users',
    userId,
    enabled = true,
  } = options;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [queryKeyPrefix, page, pageSize, role, userId],
    queryFn: async () => {
      return await listUsersAction(page, pageSize, userId);
    },
    enabled,
  });

  return {
    response: data || emptyApiResponse,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

/**
 * Hook for user mutations (create, update, delete)
 * Follows Single Responsibility Principle - only handles mutations
 * Can be used without triggering list fetch
 */
export function useUsersMutations(queryKeyPrefix: string = 'users'): UseUsersMutationsReturn {
  const queryClient = useQueryClient();

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const result = await createUserAction(data);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create user');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeyPrefix] });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserInput }) => {
      const result = await updateUserAction(id, data);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update user');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeyPrefix] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteUserAction(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete user');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeyPrefix] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}


