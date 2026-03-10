"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { useLogout } from "@/providers/StoreProvider";
import { useSelector, useDispatch } from "react-redux";
import { selectFilteredNotes } from "@/store/slices/notesSlice";
import { setSearchText, setShowSuggestions } from "@/store/slices/uiSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const logout = useLogout();
  const filteredNotes = useSelector(selectFilteredNotes);
  const searchText = useSelector((state) => state.ui.searchText);
  const showSuggestions = useSelector((state) => state.ui.showSuggestions);

  const searchFilteredNotes = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return filteredNotes;
    return filteredNotes.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q)
    );
  }, [filteredNotes, searchText]);

  const isNotes = pathname === "/notes" || pathname === "/";

  return (
    <div
      className="min-h-screen bg-[rgb(241,236,236)] flex flex-col justify-between"
      onClick={() => dispatch(setShowSuggestions(false))}
    >
      <div>
        <Header>
          <nav className="flex flex-wrap items-center gap-2">
            <Link
              href="/notes"
              className={[
                "rounded-full px-3 py-2 text-sm font-semibold transition",
                pathname === "/notes"
                  ? "bg-slate-200 text-slate-900"
                  : "bg-transparent text-slate-700 hover:bg-slate-100",
              ].join(" ")}
            >
              Notes
            </Link>
            <Link
              href="/create"
              className={[
                "rounded-full px-3 py-2 text-sm font-semibold transition",
                pathname === "/create"
                  ? "bg-slate-200 text-slate-900"
                  : "bg-transparent text-slate-700 hover:bg-slate-100",
              ].join(" ")}
            >
              Create a note
            </Link>

            {isNotes && (
              <SearchBar
                searchText={searchText}
                setSearchText={(v) => dispatch(setSearchText(v))}
                filteredNotes={searchFilteredNotes}
                setActiveTab={() => {}}
                showSuggestions={showSuggestions}
                setShowSuggestions={(v) => dispatch(setShowSuggestions(v))}
              />
            )}
          </nav>

          <Button
            variant="default"
            onClick={logout}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            Log out
          </Button>
        </Header>
        {children}
      </div>

      <Footer />
    </div>
  );
}

