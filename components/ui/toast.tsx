"use client";

import { createContext, useContext, useState } from "react";
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";

type ToastTone = "info" | "success" | "danger";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  notify: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = (message: string, tone: ToastTone = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-72 flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} role="status" className="glass flex items-start gap-2 px-3 py-2 text-body">
            {t.tone === "danger" ? (
              <AlertTriangle className="mt-0.5 h-4 w-4 text-danger" />
            ) : t.tone === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand" />
            ) : (
              <Info className="mt-0.5 h-4 w-4 text-risk-moderate" />
            )}
            <span className="text-ink-primary">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
