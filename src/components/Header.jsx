export default function Header({ children }) {
  return (
    <header className="sticky top-0 z-50 mx-4 mt-2 flex items-center justify-between gap-4 rounded-xl bg-[rgb(241,236,236)] px-4 py-3 text-[rgba(6,6,6,0.624)] shadow">
      <div className="text-2xl" aria-label="Notebook" title="My notes">
        📔
      </div>
      <div className="flex w-full items-center justify-between gap-4">
        {children}
      </div>
    </header>
  );
}

