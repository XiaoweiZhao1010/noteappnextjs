import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function Notes({
  deleteHandler,
  clickHandler,
  filteredNotes,
  editHandler,
  doubleClickHandler,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    setPendingDeleteId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      deleteHandler(pendingDeleteId);
      setModalOpen(false);
      setPendingDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setPendingDeleteId(null);
  };

  return (
    <section className="mx-auto py-2 px-4">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredNotes?.length > 0 ? (
          [...(filteredNotes ?? [])]
            .sort((a, b) => b.id - a.id)
            .map((note) => (
              <li
                key={note.id}
                className="flex cursor-pointer flex-col justify-between gap-3 rounded-xl border border-[#d5c4a1] bg-[#fffdf9] p-4 transition hover:-translate-y-0.5 hover:border-l-4 hover:border-l-[rgb(132,99,99)] hover:bg-[#aa75a596]"
                onClick={() => clickHandler(note.id)}
                onDoubleClick={() => doubleClickHandler(note)}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-slate-200 bg-[rgb(244,206,253)] px-3 py-1 text-xs font-semibold text-slate-900">
                    {note.tag}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(note.id);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        editHandler(note.id);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <p className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 shadow-inner">
                  {(note.title || "").slice(0, 20)}
                  {(note.title || "").length > 20 ? "..." : ""}
                </p>

                <p className="line-clamp-4 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner">
                  {(note.content || "").slice(0, 80)}
                  {(note.content || "").length > 80 ? "..." : ""}
                </p>
              </li>
            ))
        ) : (
          <p className="col-span-full text-center text-lg font-semibold text-[#a88134]">
            No notes found yet! Go create one!
          </p>
        )}
      </ul>

      <DeleteConfirmModal
        open={modalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </section>
  );
}

