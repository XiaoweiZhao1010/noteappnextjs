export default function SearchBar({
  searchText,
  setSearchText,
  filteredNotes,
  setActiveTab,
  showSuggestions,
  setShowSuggestions,
}) {
  const activateNotes = () => {
    if (typeof setActiveTab === "function") setActiveTab("notes");
  };

  return (
    <div className="hidden md:block relative ">
      <input
        type="text"
        className="ml-4 w-56 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        placeholder="Search notes..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setShowSuggestions(true);
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShowSuggestions(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            activateNotes();
            setShowSuggestions(false);
          }
        }}
        autoComplete="off"
      />

      {showSuggestions && searchText.trim() && (
        <ul className="absolute left-4 top-11 z-50 w-72 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow">
          {filteredNotes.length > 0 ? (
            filteredNotes.slice(0, 8).map((note) => (
              <li
                key={note.id}
                className="cursor-pointer px-4 py-2 text-sm transition hover:bg-[#f0e6ff]"
                onMouseDown={() => {
                  setSearchText(note.title);
                  activateNotes();
                  setShowSuggestions(false);
                }}
              >
                <div className="font-semibold text-slate-900">{note.title}</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {note.content.slice(0, 40)}...
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-slate-400">
              No matches found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

