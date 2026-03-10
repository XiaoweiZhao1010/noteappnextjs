"use client";

export default function NoteModal({ note, onClose }) {
  if (!note) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[999] bg-black/40"
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        onClick={onClose}
      />
      <div
        className="fixed left-1/2 top-1/2 z-[1000] w-[80vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow"
        role="document"
        tabIndex={0}
        aria-labelledby="modal-title"
        aria-describedby="modal-content"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        autoFocus
      >
        <h2 id="modal-title" className="text-xl font-semibold text-slate-900">
          {note.title}
        </h2>
        <p id="modal-content" className="mt-3 whitespace-pre-wrap text-slate-700">
          {note.content}
        </p>
        <button
          className="mt-5 rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          onClick={onClose}
          autoFocus
        >
          Close
        </button>
      </div>
    </>
  );
}

