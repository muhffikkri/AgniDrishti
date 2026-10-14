"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        aria-hidden
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : "Details"}
        tabIndex={-1}
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-line bg-panel shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-panel font-heading font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="rounded p-1 text-ink-muted hover:bg-field hover:text-ink-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        {footer ? <div className="border-t border-line p-4">{footer}</div> : null}
      </div>
    </div>
  );
}
