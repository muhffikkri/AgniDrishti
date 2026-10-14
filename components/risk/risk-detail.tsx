"use client";

import { Drawer } from "@/components/ui/drawer";
import { RiskBadge, ProvenanceBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { recommendedAction } from "@/modules/risk/risk";
import type { RiskZone } from "@/lib/types";

export function RiskDetailDrawer({
  zone,
  open,
  onClose,
  onMarkReviewed,
}: {
  zone: RiskZone | null;
  open: boolean;
  onClose: () => void;
  onMarkReviewed: (zoneId: string) => void;
}) {
  if (!zone) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={zone.name}
      footer={
        zone.reviewStatus === "pending" ? (
          <Button className="w-full" onClick={() => onMarkReviewed(zone.id)}>
            Mark as reviewed
          </Button>
        ) : (
          <p className="text-center text-meta text-ink-muted">This assessment has been reviewed.</p>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <RiskBadge band={zone.riskBand} />
          <ProvenanceBadge provenance={zone.provenance} />
          <Badge>{zone.reviewStatus === "pending" ? "Needs review" : "Reviewed"}</Badge>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-body">
          <dt className="text-ink-muted">Region</dt>
          <dd className="text-right">{zone.adminRegion}</dd>
          <dt className="text-ink-muted">Score</dt>
          <dd className="num text-right">
            {zone.riskScore !== null ? zone.riskScore.toFixed(2) : "Unknown"}
          </dd>
          <dt className="text-ink-muted">Horizon</dt>
          <dd className="text-right">
            {zone.horizonStart} → {zone.horizonEnd}
          </dd>
          <dt className="text-ink-muted">Method version</dt>
          <dd className="text-right">{zone.methodVersion}</dd>
          <dt className="text-ink-muted">Uncertainty</dt>
          <dd className="text-right capitalize">{zone.uncertainty}</dd>
          <dt className="text-ink-muted">Crop context</dt>
          <dd className="text-right capitalize">{zone.cropContext}</dd>
        </dl>

        <section>
          <h3 className="eyebrow mb-2">Contributing signals</h3>
          <ul className="flex flex-col divide-y divide-line rounded border border-line">
            {zone.signals.map((s) => (
              <li key={s.label} className="flex items-center justify-between gap-2 px-3 py-2 text-body">
                <span className="text-ink-secondary">{s.label}</span>
                <span className="flex items-center gap-2">
                  <span className="num">{s.value}</span>
                  <ProvenanceBadge provenance={s.provenance} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded border border-line bg-field px-3 py-2">
          <h3 className="eyebrow mb-1">Recommended follow-up</h3>
          <p className="text-body text-ink-secondary">{recommendedAction(zone.riskBand)}</p>
        </section>

        <section>
          <h3 className="eyebrow mb-1">Limitations</h3>
          <ul className="list-disc pl-4 text-meta text-ink-muted">
            <li>A thermal anomaly alone does not establish crop-residue burning.</li>
            <li>Scores are illustrative and have a defined horizon and method version.</li>
            <li>Risk prioritisation is for outreach, not enforcement or penalties.</li>
          </ul>
        </section>
      </div>
    </Drawer>
  );
}
