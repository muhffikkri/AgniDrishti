"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Badge, ProvenanceBadge, VerificationBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/format/format";
import { cn } from "@/lib/cn";
import type { Buyer } from "@/lib/types";
import type { RankedMatch } from "@/modules/matching/rank";

export function BuyerCard({
  match,
  selected,
  onSelect,
}: {
  match: RankedMatch;
  selected: boolean;
  onSelect: () => void;
}) {
  const { buyer, eligible, blockers, needInformation } = match;
  const r = buyer.requirements;

  return (
    <div
      className={cn(
        "panel flex flex-col gap-3 p-4 transition-colors",
        selected ? "ring-2 ring-brand" : "",
        !eligible ? "opacity-80" : ""
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-heading font-bold">{buyer.name}</p>
          <p className="text-meta text-ink-muted capitalize">
            {buyer.buyerType.replace("_", " ")} · {buyer.location} · {buyer.distanceKm} km
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {eligible ? (
            <Badge className="border-brand/40 text-brand">Eligible</Badge>
          ) : (
            <Badge className="border-danger/40 text-danger">Ineligible</Badge>
          )}
          <VerificationBadge status={buyer.verificationStatus} />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-meta">
        <dt className="text-ink-muted">Indicative price</dt>
        <dd className="num text-right">
          {formatCurrency(r.priceValue)}/{r.priceUnit}
        </dd>
        <dt className="text-ink-muted">Price basis</dt>
        <dd className="text-right capitalize">{r.priceBasis}</dd>
        <dt className="text-ink-muted">Quantity</dt>
        <dd className="num text-right">
          {formatNumber(r.minimumVolumeTonnes, 0)}–{formatNumber(r.maximumVolumeTonnes, 0)} t
        </dd>
        <dt className="text-ink-muted">Quote valid</dt>
        <dd className="text-right">
          {r.validFrom} → {r.validUntil}
        </dd>
      </dl>

      {blockers.length > 0 ? (
        <ul className="flex flex-col gap-1 rounded border border-danger/30 bg-danger/5 px-3 py-2 text-meta text-danger">
          {blockers.map((b) => (
            <li key={b}>Blocker: {b}</li>
          ))}
        </ul>
      ) : null}

      {needInformation.length > 0 ? (
        <ul className="flex flex-col gap-1 rounded border border-warn/30 bg-warn/5 px-3 py-2 text-meta text-warn">
          {needInformation.map((b) => (
            <li key={b}>Needs information: {b}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-2">
        <ProvenanceBadge provenance={buyer.provenance} />
        <Button
          variant={selected ? "primary" : "secondary"}
          disabled={!eligible}
          onClick={onSelect}
        >
          {selected ? "Selected" : eligible ? "Calculate" : "Unavailable"}
        </Button>
      </div>
    </div>
  );
}
