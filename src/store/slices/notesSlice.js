import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

const emptyNewNote = { id: null, title: "", content: "", tag: null };

const initialState = {
  notes: [],
  loading: false,
  selectedTag: null,
  activeNoteId: null,
  isEditing: false,
  newNote: emptyNewNote,
  selectedNote: null,
  error: null,
};

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (_, { rejectWithValue }) => {
    try {
      return await api.get("/notes");
    } catch {
      return rejectWithValue("Failed to fetch notes. Please try again.");
    }
  }
);

export const saveNote = createAsyncThunk(
  "notes/saveNote",
  async (_, { getState, rejectWithValue }) => {
    const { newNote } = getState().notes;
    const tag = newNote.tag != null ? String(newNote.tag).trim() : "";
    if (!tag) return rejectWithValue("Please select a tag.");
    const title = (newNote.title || "").trim();
    const content = (newNote.content || "").trim();
    if (!title || !content) return rejectWithValue(null);
    try {
      if (newNote.id) {
        const data = await api.put(`/notes/${newNote.id}`, {
          title,
          content,
          tag,
        });
        return { type: "update", data };
      }
      const data = await api.post("/notes", { title, content, tag });
      const list = await api.get("/notes");
      return { type: "create", data, list };
    } catch {
      return rejectWithValue(
        newNote.id
          ? "Failed to update note. Please try again."
          : "Failed to create note. Please try again."
      );
    }
  }
);

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notes/${id}`);
      return id;
    } catch {
      return rejectWithValue("Failed to delete note. Please try again.");
    }
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setActiveNoteId(state, action) {
      state.activeNoteId = action.payload;
    },
    setNewNote(state, action) {
      state.newNote = action.payload;
    },
    setIsEditing(state, action) {
      state.isEditing = action.payload;
    },
    setSelectedNote(state, action) {
      state.selectedNote = action.payload;
    },
    handleTagChange(state, action) {
      const tag = action.payload;
      state.selectedTag = tag;
      state.isEditing = true;
      state.newNote = { ...state.newNote, tag };
    },
    handleInputChange(state, action) {
      const { name, value } = action.payload;
      state.isEditing = true;
      state.newNote = { ...state.newNote, [name]: value };
    },
    editNote(state, action) {
      const id = action.payload;
      const noteToEdit = state.notes.find((n) => n.id === id);
      if (!noteToEdit) return;
      state.newNote = { ...noteToEdit };
      state.selectedTag = noteToEdit.tag;
      state.isEditing = true;
    },
    closeModal(state) {
      state.selectedNote = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch notes.";
      })
      .addCase(saveNote.rejected, (state, action) => {
        if (action.payload) state.error = action.payload;
      })
      .addCase(saveNote.fulfilled, (state, action) => {
        const result = action.payload;
        if (result.type === "update") {
          state.notes = state.notes.map((n) =>
            n.id === result.data.id ? result.data : n
          );
          state.activeNoteId = result.data.id;
        } else {
          state.notes = result.list;
          state.activeNoteId = result.data.id;
        }
        state.newNote = emptyNewNote;
        state.isEditing = false;
        state.selectedTag = null;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        const id = action.payload;
        state.notes = state.notes.filter((n) => Number(n.id) !== Number(id));
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setActiveNoteId,
  setNewNote,
  setIsEditing,
  setSelectedNote,
  handleTagChange,
  handleInputChange,
  editNote,
  closeModal,
} = notesSlice.actions;

export const selectFilteredNotes = (state) => {
  const { notes, selectedTag } = state.notes;
  return selectedTag
    ? notes.filter((note) => note.tag === selectedTag)
    : notes;
};

export default notesSlice.reducer;
