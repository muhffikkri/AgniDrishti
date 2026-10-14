"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAppStore } from "@/context/AppStore";
import { KpiCard } from "@/components/ui/metric";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader, EmptyState } from "@/components/ui/page";
import { RiskBadge, StatusBadge, ProvenanceBadge } from "@/components/ui/badge";
import { RiskMap } from "@/components/maps/risk-map";
import { RiskScoreChart, ResidueFlowChart } from "@/components/charts/overview-charts";
import { computeImpact } from "@/modules/impact/impact";
import { REFERENCE_PRICE_PER_TONNE } from "@/modules/pricing/reference";
import { formatCurrency, formatWeight, formatNumber } from "@/lib/format/format";
import type { RiskZone } from "@/lib/types";

export default function OverviewPage() {
  const { state } = useAppStore();
  const [selected, setSelected] = useState<RiskZone | null>(null);

  const impact = useMemo(
    () => computeImpact(state.residues, state.transactions),
    [state.residues, state.transactions]
  );

  const zonesNeedingReview = state.riskZones.filter((z) => z.reviewStatus === "pending").length;
  const indicativeSupplyValue = impact.registeredTonnes * REFERENCE_PRICE_PER_TONNE;
  const recent = state.transactions.slice(0, 5);
  const activeZone = selected ?? state.riskZones[0];

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Operational summary of risk areas and residue transactions. Every value here is simulated."
        actions={
          <Link
            href="/residue"
            className="inline-flex items-center gap-1 rounded bg-brand px-3 py-2 text-meta font-heading font-bold text-canvas hover:bg-brand-bright"
          >
            Register residue <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Risk zones to review"
          value={zonesNeedingReview}
          unit="zones"
          context="Outreach prioritisation only"
          provenance="simulated"
          accent="warn"
        />
        <KpiCard
          label="Estimated available residue"
          value={formatNumber(impact.registeredTonnes, 2)}
          unit="t"
          context="Registered, not yet verified"
          provenance="simulated"
        />
        <KpiCard
          label="Collected / sold"
          value={`${formatNumber(impact.collectedTonnes, 1)} / ${formatNumber(impact.soldTonnes, 1)}`}
          unit="t"
          context="Collected is not sold"
          provenance="simulated"
          accent="brand"
        />
        <KpiCard
          label="Indicative supply value"
          value={formatCurrency(indicativeSupplyValue)}
          context="Registered mass × illustrative price"
          provenance="derived"
          accent="moderate"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Risk map"
            subtitle="Illustrative zone markers. A hotspot is not proof of residue burning."
          />
          <RiskMap
            zones={state.riskZones}
            selectedZoneId={activeZone?.id}
            onSelectZone={setSelected}
          />
        </Card>

        <Card>
          <CardHeader title="Zone context" subtitle={activeZone ? activeZone.adminRegion : "No zone"} />
          {activeZone ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-heading font-bold">{activeZone.name}</p>
                <RiskBadge band={activeZone.riskBand} />
              </div>
              <dl className="grid grid-cols-2 gap-2 text-meta">
                <dt className="text-ink-muted">Score</dt>
                <dd className="num text-right">{activeZone.riskScore.toFixed(2)} (0–1)</dd>
                <dt className="text-ink-muted">Horizon</dt>
                <dd className="text-right">
                  {activeZone.horizonStart} → {activeZone.horizonEnd}
                </dd>
                <dt className="text-ink-muted">Method</dt>
                <dd className="text-right">{activeZone.methodVersion}</dd>
                <dt className="text-ink-muted">Uncertainty</dt>
                <dd className="text-right capitalize">{activeZone.uncertainty}</dd>
              </dl>
              <p className="rounded border border-line bg-field px-2 py-1.5 text-meta text-ink-muted">
                Score is a prioritisation signal with a defined horizon and method version — not a
                probability of burning.
              </p>
              <Link
                href="/risk-intelligence"
                className="inline-flex items-center gap-1 text-meta text-brand hover:text-brand-bright"
              >
                Open risk intelligence <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <EmptyState title="No zones available" />
          )}
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Risk score by zone"
            subtitle="Illustrative scores (0–100%)."
            action={<ProvenanceBadge provenance="simulated" />}
          />
          <RiskScoreChart zones={state.riskZones} />
        </Card>
        <Card>
          <CardHeader
            title="Residue flow"
            subtitle="Registered ≠ verified ≠ collected ≠ sold."
            action={<ProvenanceBadge provenance="derived" />}
          />
          <ResidueFlowChart
            registered={impact.registeredTonnes}
            verified={impact.verifiedTonnes}
            collected={impact.collectedTonnes}
            sold={impact.soldTonnes}
          />
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent transactions"
            subtitle="Demo transactions — no real payments or collections."
            action={
              <Link href="/transactions" className="text-meta text-brand hover:text-brand-bright">
                View all
              </Link>
            }
          />
          {recent.length === 0 ? (
            <EmptyState title="No transactions yet">
              Register residue to start a demo transaction.
            </EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body">
                <thead className="text-meta text-ink-muted">
                  <tr>
                    <th className="py-2 pr-3 font-medium">ID</th>
                    <th className="py-2 pr-3 font-medium">Quantity</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((t) => (
                    <tr key={t.id} className="border-t border-line">
                      <td className="py-2 pr-3 font-medium">{t.id}</td>
                      <td className="num py-2 pr-3">{formatWeight(t.estimatedQuantityTonnes)}</td>
                      <td className="py-2 pr-3">
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Data-quality notices" />
          <ul className="flex flex-col gap-2 text-meta text-ink-secondary">
            <li>All records are simulated and not field-verified.</li>
            <li>Environmental impact is not estimated (no defensible counterfactual).</li>
            <li>Buyer quotes are illustrative and unverified.</li>
            <li>Collected mass is not automatically diverted from burning.</li>
          </ul>
        </Card>
      </div>
    </>
  );
}
