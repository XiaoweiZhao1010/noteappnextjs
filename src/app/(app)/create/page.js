"use client";

import CreateNote from "@/components/CreateNote";
import { useDispatch, useSelector } from "react-redux";
import {
  saveNote,
  handleInputChange,
  handleTagChange,
} from "@/store/slices/notesSlice";
import { setSearchText } from "@/store/slices/uiSlice";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const newNote = useSelector((state) => state.notes.newNote);
  const selectedTag = useSelector((state) => state.notes.selectedTag);
  const isEditing = useSelector((state) => state.notes.isEditing);
  const error = useSelector((state) => state.notes.error);

  const onSave = () => {
    dispatch(saveNote())
      .unwrap()
      .then(() => {
        dispatch(setSearchText(""));
        setTimeout(() => router.push("/notes"), 0);
      });
  };

  return (
    <CreateNote
      handleInputChange={(e) =>
        dispatch(
          handleInputChange({ name: e.target.name, value: e.target.value })
        )
      }
      handleSave={onSave}
      newNote={newNote}
      handleTagChange={(tag) => dispatch(handleTagChange(tag))}
      selectedTag={selectedTag}
      isEditing={isEditing}
      error={error}
    />
  );
}

