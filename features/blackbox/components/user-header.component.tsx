export interface UserHeaderProps {
  isFormOpen: boolean;
  onCreateClick: () => void;
}

/**
 * User Header Component
 * Displays the header section for user management with title and create button
 */
export function UserHeader({ isFormOpen, onCreateClick }: UserHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900">Users</h1>
      {!isFormOpen && (
        <button
          onClick={onCreateClick}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          + Create User
        </button>
      )}
    </div>
  );
}

