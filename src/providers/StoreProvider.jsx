"use client";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "@/store";
import { setUser, setReady, logout } from "@/store/slices/authSlice";
import { fetchNotes } from "@/store/slices/notesSlice";
import AuthForm from "@/components/AuthForm";

function AuthRehydrate({ children }) {
  const dispatch = useDispatch();
  const { user, isReady } = useSelector((state) => state.auth);

  useEffect(() => {
    const saved = sessionStorage.getItem("currentUser");
    try {
      const parsed = saved ? JSON.parse(saved) : null;
      dispatch(setUser(parsed && typeof parsed === "object" ? parsed : null));
    } catch {
      dispatch(setUser(null));
    }
    dispatch(setReady(true));
  }, [dispatch]);

  useEffect(() => {
    if (user) dispatch(fetchNotes());
  }, [user, dispatch]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[rgb(241,236,236)]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onLogin={(userObj) => dispatch(setUser(userObj))} />;
  }

  return children;
}

export function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthRehydrate>{children}</AuthRehydrate>
    </Provider>
  );
}

export function useLogout() {
  const dispatch = useDispatch();
  return () => {
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("jwtToken");
    dispatch(logout());
  };
}
