"use client";

import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { useAppStore } from "@/context/AppStore";
import { PageHeader } from "@/components/ui/page";
import { Card, CardHeader } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/metric";
import { ProvenanceBadge } from "@/components/ui/badge";
import { ResidueFlowChart } from "@/components/charts/overview-charts";
import { computeImpact } from "@/modules/impact/impact";
import { DATA_SOURCES, METHOD_LIMITATIONS } from "@/lib/data-sources";
import { formatCurrency, formatNumber } from "@/lib/format/format";

export default function ImpactPage() {
  const { state } = useAppStore();
  const impact = useMemo(
    () => computeImpact(state.residues, state.transactions),
    [state.residues, state.transactions]
  );

  return (
    <>
      <PageHeader
        title="Impact & Evidence"
        subtitle="Operational metrics are kept separate from environmental impact. Environmental impact is not estimated."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Registered" value={formatNumber(impact.registeredTonnes, 2)} unit="t" provenance="simulated" />
        <KpiCard label="Verified" value={formatNumber(impact.verifiedTonnes, 2)} unit="t" provenance="simulated" />
        <KpiCard label="Collected" value={formatNumber(impact.collectedTonnes, 2)} unit="t" provenance="simulated" accent="brand" />
        <KpiCard label="Sold" value={formatNumber(impact.soldTonnes, 2)} unit="t" provenance="simulated" accent="warn" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Residue flow"
            subtitle="Registered, verified, collected and sold are distinct metrics."
            action={<ProvenanceBadge provenance="derived" />}
          />
          <ResidueFlowChart
            registered={impact.registeredTonnes}
            verified={impact.verifiedTonnes}
            collected={impact.collectedTonnes}
            sold={impact.soldTonnes}
          />
        </Card>

        <Card>
          <CardHeader title="Operational summary" action={<ProvenanceBadge provenance="simulated" />} />
          <dl className="flex flex-col gap-2 text-body">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Active transactions</dt>
              <dd className="num">{impact.activeTransactions}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Completed</dt>
              <dd className="num">{impact.completedTransactions}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Completion rate</dt>
              <dd className="num">{(impact.completionRate * 100).toFixed(0)}%</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2">
              <dt className="text-ink-muted">Indicative farmer net (sold)</dt>
              <dd className="num">{formatCurrency(impact.indicativeFarmerNet)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-meta text-ink-muted">
            Indicative farmer net is an estimate, not a measured outcome, and may omit costs.
          </p>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Environmental impact" action={<ProvenanceBadge provenance="simulated" />} />
          <div className="rounded border border-warn/30 bg-warn/5 px-3 py-3">
            <p className="flex items-center gap-2 font-heading font-bold text-warn">
              <AlertTriangle className="h-4 w-4" /> Not estimated
            </p>
            <dl className="mt-2 flex flex-col gap-1 text-body">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Likely diverted mass</dt>
                <dd className="num">{impact.likelyDivertedTonnes === null ? "Not estimated" : "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Avoided emissions</dt>
                <dd className="num">
                  {impact.estimatedAvoidedEmissions === null
                    ? "Not estimated"
                    : `${impact.estimatedAvoidedEmissions} ${impact.emissionsUnit}`}
                </dd>
              </div>
            </dl>
          </div>
          <p className="mt-3 text-meta text-ink-muted">
            Avoided burning and emissions require a documented counterfactual, suitable emission
            factors and clear system boundaries. Until then these values are not estimated rather
            than fabricated.
          </p>
        </Card>

        <Card>
          <CardHeader title="Calculation assumptions and limitations" />
          <ul className="flex flex-col gap-2 text-body text-ink-secondary">
            {METHOD_LIMITATIONS.map((m) => (
              <li key={m} className="flex gap-2">
                <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-muted" />
                {m}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Data sources and provenance"
          subtitle="Candidate sources for the future operational system."
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-body">
            <thead className="text-meta text-ink-muted">
              <tr className="border-b border-line">
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium">Intended use</th>
                <th className="px-3 py-2 font-medium">Limitations</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Provenance</th>
              </tr>
            </thead>
            <tbody>
              {DATA_SOURCES.map((s) => (
                <tr key={s.source} className="border-b border-line last:border-0">
                  <td className="px-3 py-2 font-medium">{s.source}</td>
                  <td className="px-3 py-2 text-ink-secondary">{s.intendedUse}</td>
                  <td className="px-3 py-2 text-ink-muted">{s.limitations}</td>
                  <td className="px-3 py-2 text-ink-muted">{s.status}</td>
                  <td className="px-3 py-2">
                    <ProvenanceBadge provenance={s.provenance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
