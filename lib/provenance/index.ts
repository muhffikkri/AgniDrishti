import type { Provenance, VerificationStatus } from "@/lib/types";

export function provenanceLabel(p: Provenance) {
  return {
    simulated: "SIMULATED",
    observed: "OBSERVED",
    derived: "DERIVED",
    verified: "VERIFIED",
  }[p];
}

export function provenanceColor(p: Provenance) {
  return {
    simulated: "bg-line text-ink-muted",
    observed: "bg-risk-moderate/20 text-risk-moderate",
    derived: "bg-warn/20 text-warn",
    verified: "bg-brand/20 text-brand",
  }[p];
}

export function verificationLabel(v: VerificationStatus) {
  return {
    unverified: "Unverified",
    pending: "Pending",
    verified: "Verified",
    rejected: "Rejected",
    needs_review: "Needs review",
  }[v];
}
