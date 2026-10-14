"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/page";
import { ProvenanceBadge, VerificationBadge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/format/format";
import type { ResidueRecord } from "@/lib/types";

export function ResidueList({ residues }: { residues: ResidueRecord[] }) {
  return (
    <Card>
      <CardHeader
        title="Registered residue"
        subtitle="Estimated quantities are separate from any measured weight."
      />
      {residues.length === 0 ? (
        <EmptyState title="No residue registered yet">
          Use the form above to register available straw.
        </EmptyState>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-body">
            <thead className="text-meta text-ink-muted">
              <tr className="border-b border-line">
                <th className="px-3 py-2 font-medium">ID</th>
                <th className="px-3 py-2 font-medium">Crop / residue</th>
                <th className="px-3 py-2 font-medium">Area</th>
                <th className="px-3 py-2 font-medium">Estimated</th>
                <th className="px-3 py-2 font-medium">Measured</th>
                <th className="px-3 py-2 font-medium">Available</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Provenance</th>
              </tr>
            </thead>
            <tbody>
              {residues.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0 hover:bg-panel-strong">
                  <td className="px-3 py-2">
                    <div className="font-medium">{r.id}</div>
                    <div className="text-meta text-ink-muted">{r.zoneId}</div>
                  </td>
                  <td className="px-3 py-2 capitalize text-ink-secondary">
                    {r.cropType} · {r.residueType}
                    <div className="text-meta text-ink-muted">
                      {r.condition.replace("_", " ")} · {r.handlingForm}
                    </div>
                  </td>
                  <td className="num px-3 py-2">
                    {formatNumber(r.fieldAreaValue)} {r.fieldAreaUnit}
                  </td>
                  <td className="num px-3 py-2">{formatNumber(r.estimatedQuantityTonnes)} t</td>
                  <td className="num px-3 py-2 text-ink-muted">
                    {r.measuredQuantityTonnes === null ? "Not measured" : `${formatNumber(r.measuredQuantityTonnes)} t`}
                  </td>
                  <td className="px-3 py-2 text-meta text-ink-muted">
                    {r.availableFrom} → {r.availableUntil}
                  </td>
                  <td className="px-3 py-2">
                    <VerificationBadge status={r.verificationStatus} />
                  </td>
                  <td className="px-3 py-2">
                    <ProvenanceBadge provenance={r.provenance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
