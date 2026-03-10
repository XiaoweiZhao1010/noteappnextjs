export default function DeleteConfirmModal({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow">
        <h2 className="text-xl font-semibold text-slate-900">Confirm Delete</h2>
        <p className="mt-2 text-sm text-slate-600">
          Are you sure you want to delete this note? This action cannot be
          undone.
        </p>

        <div className="mt-5 flex justify-center gap-3">
          <button
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

