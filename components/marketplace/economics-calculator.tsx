"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { ProvenanceBadge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { formatCurrency, formatNumber } from "@/lib/format/format";
import { defaultCosts, economicsFor, type CostInputs } from "@/modules/pricing/logistics";
import type { Buyer, ResidueRecord } from "@/lib/types";

function Row({
  label,
  value,
  negative,
  strong,
}: {
  label: string;
  value: string;
  negative?: boolean;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 py-1.5 text-body",
        strong ? "border-t border-line font-bold" : ""
      )}
    >
      <span className={strong ? "" : "text-ink-secondary"}>{label}</span>
      <span className={cn("num", negative ? "text-danger" : "")}>{value}</span>
    </div>
  );
}

export function EconomicsCalculator({
  residue,
  buyer,
  onCreateOffer,
}: {
  residue: ResidueRecord;
  buyer: Buyer;
  onCreateOffer: (net: number) => void;
}) {
  const [costs, setCosts] = useState<CostInputs>(() => defaultCosts(residue, buyer));

  useEffect(() => {
    setCosts(defaultCosts(residue, buyer));
  }, [residue.id, buyer.id]);

  const econ = useMemo(() => economicsFor(residue, buyer, costs), [residue, buyer, costs]);
  const delivered = buyer.requirements.priceBasis === "delivered";

  return (
    <Card>
      <CardHeader
        title="Economic calculator"
        subtitle={`${buyer.name} · ${buyer.requirements.priceBasis} quote`}
        action={<ProvenanceBadge provenance="derived" />}
      />

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Sellable quantity (t)" htmlFor="calc-qty">
          <Input id="calc-qty" value={formatNumber(econ.sellableQuantityTonnes)} readOnly />
        </Field>
        <Field label="Price (₹/t)" htmlFor="calc-price">
          <Input id="calc-price" value={formatNumber(econ.pricePerTonne)} readOnly />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Transport cost (₹)" htmlFor="calc-transport">
          <Input
            id="calc-transport"
            type="number"
            min="0"
            value={costs.transportCost}
            onChange={(e) => setCosts((c) => ({ ...c, transportCost: Number(e.target.value) }))}
          />
        </Field>
        <Field label="Loading cost (₹)" htmlFor="calc-loading">
          <Input
            id="calc-loading"
            type="number"
            min="0"
            value={costs.loadingCost}
            onChange={(e) => setCosts((c) => ({ ...c, loadingCost: Number(e.target.value) }))}
          />
        </Field>
        <Field label="Baling cost (₹)" htmlFor="calc-baling">
          <Input
            id="calc-baling"
            type="number"
            min="0"
            value={costs.balingCost}
            onChange={(e) => setCosts((c) => ({ ...c, balingCost: Number(e.target.value) }))}
          />
        </Field>
      </div>

      <div className="mt-3 rounded border border-line bg-field px-3 py-1">
        <Row label="Gross value (qty × price)" value={formatCurrency(econ.grossValue)} />
        <Row
          label="Transport"
          value={`− ${formatCurrency(econ.transportCost)}`}
          negative={econ.transportCost > 0}
        />
        <Row label="Loading" value={`− ${formatCurrency(econ.loadingCost)}`} negative={econ.loadingCost > 0} />
        <Row label="Baling" value={formatCurrency(econ.balingCost) === "₹0" ? "₹0" : `− ${formatCurrency(econ.balingCost)}`} />
        <Row label="Other known costs" value={formatCurrency(econ.otherKnownCosts)} />
        <Row
          label="Indicative net proceeds"
          value={formatCurrency(econ.indicativeNetProceeds)}
          strong
          negative={econ.indicativeNetProceeds < 0}
        />
      </div>

      {delivered ? (
        <p className="mt-2 text-meta text-ink-muted">
          This is a delivered quote. Transport is already included in the price, so it is not
          subtracted again.
        </p>
      ) : null}

      {econ.missingCosts.length > 0 ? (
        <p className="mt-2 text-meta text-warn">
          Partial estimate — missing: {econ.missingCosts.join(", ")}. Indicative net proceeds are not
          profit.
        </p>
      ) : (
        <p className="mt-2 text-meta text-ink-muted">
          Indicative net proceeds are not necessarily profit; compare against the farmer's real
          alternative.
        </p>
      )}

      <Button className="mt-3 w-full" onClick={() => onCreateOffer(econ.indicativeNetProceeds)}>
        Create demo offer for {buyer.name}
      </Button>
    </Card>
  );
}
