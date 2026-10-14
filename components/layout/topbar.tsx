"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, ShieldAlert } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { useAppStore } from "@/context/AppStore";

export function Topbar({ onOpenNav }: { onOpenNav: () => void }) {
  const pathname = usePathname();
  const { state } = useAppStore();
  const current = NAV_ITEMS.find((n) => n.href === pathname);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-canvas/90 px-4 backdrop-blur">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="rounded p-1.5 text-ink-secondary hover:bg-panel lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate font-heading text-body font-bold">
          {current?.label ?? "Overview"}
        </p>
        <p className="truncate text-meta text-ink-muted">
          {state.metadata.region} · as of {state.metadata.asOf}
        </p>
      </div>

      <span
        className="hidden items-center gap-1.5 rounded-badge border border-warn/40 px-2 py-1 text-eyebrow font-heading font-bold text-warn sm:flex"
        title={state.metadata.warning}
      >
        <ShieldAlert aria-hidden className="h-3.5 w-3.5" />
        SIMULATED DATA
      </span>

      <button
        type="button"
        aria-label="Notifications"
        className="rounded p-1.5 text-ink-secondary hover:bg-panel"
      >
        <Bell className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-eyebrow font-heading font-bold text-brand">
          DO
        </span>
        <span className="hidden text-meta text-ink-secondary sm:inline">Demo operator</span>
      </div>
    </header>
  );
}
