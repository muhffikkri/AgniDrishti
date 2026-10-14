import { AlertTriangle, Inbox, Loader2, SearchX, ShieldAlert } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-page font-heading font-extrabold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-body text-ink-secondary">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function DemoNotice({ children }: { children?: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 rounded border border-line bg-panel-strong px-3 py-2 text-meta text-ink-muted">
      <ShieldAlert aria-hidden className="h-3.5 w-3.5 text-warn" />
      {children ?? "Illustrative map and simulated records — not for navigation or enforcement."}
    </p>
  );
}

function StateShell({
  icon,
  title,
  children,
  tone = "muted",
}: {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  tone?: "muted" | "danger" | "warn";
}) {
  const toneClass = tone === "danger" ? "text-danger" : tone === "warn" ? "text-warn" : "text-ink-muted";
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-card border border-dashed border-line px-6 py-10 text-center">
      <span className={toneClass}>{icon}</span>
      <p className="font-heading font-bold">{title}</p>
      <div className="max-w-md text-body text-ink-secondary">{children}</div>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return <StateShell icon={<Inbox className="h-6 w-6" />} title={title}>{children}</StateShell>;
}

export function ErrorState({ title, children }: { title: string; children?: React.ReactNode }) {
  return <StateShell tone="danger" icon={<AlertTriangle className="h-6 w-6" />} title={title}>{children}</StateShell>;
}

export function NoMatchState({ title, children }: { title: string; children?: React.ReactNode }) {
  return <StateShell tone="warn" icon={<SearchX className="h-6 w-6" />} title={title}>{children}</StateShell>;
}

export function LoadingState({ title = "Loading…" }: { title?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-card border border-line px-6 py-10 text-ink-secondary">
      <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
      <span className="text-body">{title}</span>
    </div>
  );
}
