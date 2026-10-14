"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, RotateCcw } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/context/AppStore";
import { useToast } from "@/components/ui/toast";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { reset } = useAppStore();
  const { notify } = useToast();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/15 text-brand">
          <Flame className="h-5 w-5" />
        </span>
        <div>
          <p className="font-heading text-panel font-extrabold leading-none">AgniDrishti</p>
          <p className="text-eyebrow text-ink-muted">Jerami Jadi Rupiah</p>
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex-1 px-2">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded px-3 py-2 text-body transition-colors",
                    active
                      ? "bg-brand/10 text-brand-bright"
                      : "text-ink-secondary hover:bg-panel hover:text-ink-primary"
                  )}
                >
                  <Icon aria-hidden className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line p-3">
        <button
          type="button"
          onClick={() => {
            reset();
            notify("Demo data reset to fixtures.", "info");
          }}
          className="flex w-full items-center gap-2 rounded px-3 py-2 text-meta text-ink-muted hover:bg-panel hover:text-ink-primary"
        >
          <RotateCcw aria-hidden className="h-3.5 w-3.5" />
          Reset demo data
        </button>
      </div>
    </div>
  );
}
