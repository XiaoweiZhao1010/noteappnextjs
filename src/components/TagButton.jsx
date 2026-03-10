import PredefinedTags from "./PredefinedTags";

export default function TagButton({ handleTagChange, selectedTag }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PredefinedTags.map((tagObj) => {
        const selected = selectedTag === tagObj.tag;
        return (
          <button
            key={tagObj.tag}
            type="button"
            onClick={() => handleTagChange(tagObj.tag)}
            className={[
              "rounded-lg border px-3 py-1 text-sm font-medium transition",
              selected ? "text-white border-transparent" : "text-black",
            ].join(" ")}
            style={{
              backgroundColor: selected ? tagObj.color : "rgb(244, 206, 253)",
            }}
          >
            {tagObj.tag}
          </button>
        );
      })}
    </div>
  );
}

