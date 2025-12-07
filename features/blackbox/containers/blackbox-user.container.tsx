'use client';

import { useBlackboxUser } from '../hooks/use-blackbox-user.hook';
import { UserHeader } from '../components/user-header.component';
import { UserList } from '../components/user-list.component';
import { UserEditForm } from '../components/user-edit-form.component';

/**
 * Blackbox User Container
 * Orchestrates user management UI components
 * Note: This is rendered within the BlackboxContainer, so no need for full page layout
 */
export function BlackboxUserContainer() {
  const {
    users,
    total,
    page,
    pageSize,
    isLoading,
    error,
    formMode,
    editingUser,
    createMutation,
    updateMutation,
    handlePageChange,
    handleCreate,
    handleEdit,
    handleCancel,
    handleSubmit,
    handleDelete,
  } = useBlackboxUser();

  const isFormOpen = formMode !== '';
  const isFormLoading = createMutation.isPending || updateMutation.isPending;
  const formError =
    (createMutation.error instanceof Error ? createMutation.error.message : '') ||
    (updateMutation.error instanceof Error ? updateMutation.error.message : '') ||
    '';

  return (
    <>
      <UserHeader isFormOpen={isFormOpen} onCreateClick={handleCreate} />

      {/* Error Message */}
      {error && !isFormOpen && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* User List */}
      {!isFormOpen && (
        <UserList
          users={users}
          total={total}
          page={page}
          pageSize={pageSize}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
        />
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl m-4">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {formMode === 'create' ? 'Create User' : 'Edit User'}
              </h2>
              <UserEditForm
                mode={formMode}
                user={editingUser}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isFormLoading}
                error={formError}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

