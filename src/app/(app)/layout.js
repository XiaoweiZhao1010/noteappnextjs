"use client";

import { StoreProvider } from "@/providers/StoreProvider";
import AppShell from "@/components/AppShell";

export default function AppLayout({ children }) {
  return (
    <StoreProvider>
      <AppShell>{children}</AppShell>
    </StoreProvider>
  );
}
