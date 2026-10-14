import { cn } from "@/lib/cn";
import { provenanceColor, provenanceLabel } from "@/lib/provenance";
import { riskBandColor, riskBandLabel } from "@/modules/risk/risk";
import type { Provenance, RiskBand, VerificationStatus } from "@/lib/types";

export function Badge({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1 rounded-badge border border-line px-2 py-0.5 text-eyebrow font-heading font-bold uppercase",
        className
      )}
    >
      {children}
    </span>
  );
}

export function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  return (
    <Badge
      className={provenanceColor(provenance)}
      title="Data provenance — separate from verification and transaction status"
    >
      {provenanceLabel(provenance)}
    </Badge>
  );
}

export function RiskBadge({ band }: { band: RiskBand }) {
  return (
    <Badge
      className={cn("border-transparent")}
      title="Risk band used for outreach prioritisation, not an accusation"
    >
      <span
        aria-hidden
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: riskBandColor(band) }}
      />
      {riskBandLabel(band)}
    </Badge>
  );
}

const VERIFICATION_STYLE: Record<VerificationStatus, string> = {
  unverified: "text-ink-muted",
  pending: "text-warn",
  verified: "text-brand",
  rejected: "text-danger",
  needs_review: "text-warn",
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const label = status.replace("_", " ");
  return <Badge className={VERIFICATION_STYLE[status]}>{label}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Draft: "text-ink-muted border-line",
    Offered: "text-risk-moderate border-risk-moderate/40",
    "Farmer Accepted": "text-brand border-brand/40",
    "Pickup Scheduled": "text-brand border-brand/40",
    "Collected / Weighed": "text-brand border-brand/40",
    "Payment Pending": "text-warn border-warn/40",
    Completed: "text-brand border-brand/40",
    Rejected: "text-danger border-danger/40",
    Cancelled: "text-ink-muted border-line",
    Disputed: "text-danger border-danger/40",
    "Needs Review": "text-warn border-warn/40",
  };
  return <Badge className={map[status] ?? "text-ink-muted"}>{status}</Badge>;
}
