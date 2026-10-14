import { cn } from "@/lib/cn";
import { ProvenanceBadge } from "@/components/ui/badge";
import type { Provenance } from "@/lib/types";

export function KpiCard({
  label,
  value,
  unit,
  context,
  provenance,
  accent,
  className,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  context?: React.ReactNode;
  provenance?: Provenance;
  accent?: "brand" | "warn" | "danger" | "moderate";
  className?: string;
}) {
  const accentClass = {
    brand: "text-brand-bright",
    warn: "text-warn",
    danger: "text-danger",
    moderate: "text-risk-moderate",
  }[accent ?? "brand"];

  return (
    <div className={cn("panel flex flex-col gap-1 p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="eyebrow">{label}</p>
        {provenance ? <ProvenanceBadge provenance={provenance} /> : null}
      </div>
      <p className={cn("num font-heading text-[24px] font-extrabold leading-tight", accentClass)}>
        {value}
        {unit ? <span className="ml-1 text-body font-medium text-ink-muted">{unit}</span> : null}
      </p>
      {context ? <p className="text-meta text-ink-muted">{context}</p> : null}
    </div>
  );
}

export function MetricRow({
  label,
  value,
  strong,
  tone,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  strong?: boolean;
  tone?: "positive" | "negative" | "muted";
}) {
  const toneClass =
    tone === "negative"
      ? "text-danger"
      : tone === "muted"
        ? "text-ink-muted"
        : tone === "positive"
          ? "text-brand-bright"
          : "";
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-1.5",
        strong && "border-t border-line pt-2 font-bold"
      )}
    >
      <span className={cn("text-body", strong ? "text-ink-primary" : "text-ink-secondary")}>
        {label}
      </span>
      <span className={cn("num text-body", toneClass)}>{value}</span>
    </div>
  );
}
