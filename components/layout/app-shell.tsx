"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-line lg:block">
        <Sidebar />
      </aside>

      {navOpen ? (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            aria-hidden
            className="absolute inset-0 bg-black/50"
            onClick={() => setNavOpen(false)}
          />
          <div className="relative z-10 h-full w-60 border-r border-line">
            <Sidebar onNavigate={() => setNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-60">
        <Topbar onOpenNav={() => setNavOpen(true)} />
        <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
