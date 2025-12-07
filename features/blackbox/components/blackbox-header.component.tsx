/**
 * Blackbox Header Component
 * Displays the header section for the blackbox admin tool
 */
export function BlackboxHeader() {
  return (
    <div className="bg-gray-900 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Blackbox Admin Tool</h1>
        <p className="mt-2 text-gray-300">Database CRUD Operations & Schema Visualization</p>
      </div>
    </div>
  );
}


