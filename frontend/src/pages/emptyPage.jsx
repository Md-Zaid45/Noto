export default function EmptyState({ setExpandLeftbar }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="text-6xl mb-4">📝</div>

      <h1 className="text-2xl font-semibold mb-2">No note selected</h1>

      <p className="text-gray-500 mb-6 max-w-md">
        Select a note from the sidebar or create a new one to get started.
      </p>

      <div className="flex gap-3">
        <button
          className="border px-4 py-2 rounded-lg hover:bg-gray-100"
          onClick={() => setExpandLeftbar(true)}
        >
          Browse Notes
        </button>
      </div>
    </div>
  );
}
