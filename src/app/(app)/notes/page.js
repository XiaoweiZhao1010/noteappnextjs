"use client";

import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Notes from "@/components/Notes";
import NoteModal from "@/components/NoteModal";
import {
  selectFilteredNotes,
  deleteNote,
  editNote,
  setSelectedNote,
  closeModal,
} from "@/store/slices/notesSlice";

export default function NotesPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.notes.loading);
  const selectedNote = useSelector((state) => state.notes.selectedNote);
  const searchText = useSelector((state) => state.ui.searchText);
  const notesByTag = useSelector(selectFilteredNotes);

  const filtered = useMemo(() => {
    const q = (searchText || "").trim().toLowerCase();
    if (!q) return notesByTag;
    return notesByTag.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q)
    );
  }, [notesByTag, searchText]);

  const clickHandler = useCallback(
    (id) => {
      const note = notesByTag.find((n) => n.id === id);
      dispatch(setSelectedNote(note ?? null));
    },
    [dispatch, notesByTag]
  );

  const doubleClickHandler = useCallback(
    (note) => {
      dispatch(setSelectedNote(note));
    },
    [dispatch]
  );

  const deleteHandler = useCallback(
    (id) => {
      dispatch(deleteNote(id));
    },
    [dispatch]
  );

  const editHandler = useCallback(
    (id) => {
      dispatch(editNote(id));
      router.push("/create");
    },
    [dispatch, router]
  );

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-center text-slate-700">
        Loading notes...
      </div>
    );
  }

  return (
    <>
      <Notes
        deleteHandler={deleteHandler}
        clickHandler={clickHandler}
        editHandler={editHandler}
        filteredNotes={filtered}
        doubleClickHandler={doubleClickHandler}
      />
      <NoteModal note={selectedNote} onClose={handleCloseModal} />
    </>
  );
}
