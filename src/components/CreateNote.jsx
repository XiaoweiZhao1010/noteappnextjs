import { SaveIcon } from "lucide-react";
import TagButton from "./TagButton";

export default function CreateNote({
  handleInputChange,
  handleSave,
  newNote,
  handleTagChange,
  selectedTag,
  isEditing,
}) {
  return (
    <section className="mx-auto max-w-2xl px-4 pb-10 pt-8">
      <h2 className="text-center text-xl font-semibold text-slate-800">
        {isEditing ? (
          <span className="inline-block rounded-lg bg-amber-100 px-3 py-2 text-amber-900">
            ✏️ Editing Note — Don&#39;t forget to save!
          </span>
        ) : (
          <span className="inline-block rounded-lg bg-white/70 px-3 py-2 shadow-sm">
            📝 Create a Note
          </span>
        )}
      </h2>

      <div className="mt-5">
        <TagButton handleTagChange={handleTagChange} selectedTag={selectedTag} />
      </div>

      <div className="mt-6 rounded-xl bg-white/70 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <input
            autoFocus
            className="w-full rounded-lg border border-slate-300 text-black px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            type="text"
            name="title"
            onChange={handleInputChange}
            placeholder="Here goes your title..."
            value={newNote.title}
            required
          />
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 transition hover:bg-slate-800 active:scale-95"
            onClick={handleSave}
            aria-label="Save note"
            title="Save"
          >
            <SaveIcon className="w-6 h-6"/>
          </button>
        </div>

        <textarea
          className="mt-3 h-44 w-full resize-none rounded-lg border border-slate-300 text-black px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          onChange={handleInputChange}
          name="content"
          placeholder="Take a note..."
          rows="6"
          value={newNote.content}
          required
        />
      </div>
    </section>
  );
}

