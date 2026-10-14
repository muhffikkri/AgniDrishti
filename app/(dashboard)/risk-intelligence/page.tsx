"use client";

import { useState } from "react";
import { useAppStore } from "@/context/AppStore";
import { PageHeader } from "@/components/ui/page";
import { RiskBadge, ProvenanceBadge } from "@/components/ui/badge";
import { RiskDetailDrawer } from "@/components/risk/risk-detail";
import { useToast } from "@/components/ui/toast";
import type { RiskBand, RiskZone } from "@/lib/types";

export default function RiskIntelligencePage() {
  const { state, dispatch } = useAppStore();
  const { notify } = useToast();
  const [band, setBand] = useState<RiskBand | "all">("all");
  const [review, setReview] = useState<"all" | "pending" | "reviewed">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<RiskZone | null>(null);

  const filtered = state.riskZones.filter((z) => {
    if (band !== "all" && z.riskBand !== band) return false;
    if (review !== "all" && z.reviewStatus !== review) return false;
    if (query && !`${z.id} ${z.name} ${z.adminRegion}`.toLowerCase().includes(query.toLowerCase()))
      return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Risk Intelligence"
        subtitle="Illustrative risk zones with contributing signals and provenance. For outreach prioritisation only."
      />

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <label className="flex items-center gap-2 rounded border border-line bg-field px-3 py-2">
          <span className="sr-only">Search zones</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search zone or region"
            className="w-full bg-transparent text-body text-ink-primary placeholder:text-ink-muted focus:outline-none"
          />
        </label>
        <select
          aria-label="Filter by risk band"
          value={band}
          onChange={(e) => setBand(e.target.value as RiskBand | "all")}
          className="rounded border border-line bg-field px-3 py-2 text-body text-ink-primary"
        >
          <option value="all">All risk bands</option>
          <option value="elevated">Elevated</option>
          <option value="moderate">Moderate</option>
          <option value="lower">Lower</option>
          <option value="unknown">Unknown</option>
        </select>
        <select
          aria-label="Filter by review status"
          value={review}
          onChange={(e) => setReview(e.target.value as "all" | "pending" | "reviewed")}
          className="rounded border border-line bg-field px-3 py-2 text-body text-ink-primary"
        >
          <option value="all">All review states</option>
          <option value="pending">Needs review</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="panel p-4">
          <p className="mb-2 text-body">No zones match the current filters.</p>
          <p className="text-meta text-ink-muted">
            Try clearing the search or selecting a different risk band.
          </p>
        </div>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-body">
            <thead className="text-meta text-ink-muted">
              <tr className="border-b border-line">
                <th className="px-3 py-2 font-medium">Zone</th>
                <th className="px-3 py-2 font-medium">Region</th>
                <th className="px-3 py-2 font-medium">Band</th>
                <th className="px-3 py-2 font-medium">Score</th>
                <th className="px-3 py-2 font-medium">Horizon</th>
                <th className="px-3 py-2 font-medium">Review</th>
                <th className="px-3 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((z) => (
                <tr key={z.id} className="border-b border-line last:border-0 hover:bg-panel-strong">
                  <td className="px-3 py-2">
                    <div className="font-medium">{z.name}</div>
                    <div className="text-meta text-ink-muted">
                      {z.id} · {z.cropContext}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-ink-secondary">{z.adminRegion}</td>
                  <td className="px-3 py-2">
                    <RiskBadge band={z.riskBand} />
                  </td>
                  <td className="num px-3 py-2">
                    {z.riskScore !== null ? z.riskScore.toFixed(2) : "—"}
                  </td>
                  <td className="px-3 py-2 text-meta text-ink-muted">
                    {z.horizonStart} → {z.horizonEnd}
                  </td>
                  <td className="px-3 py-2">
                    <span className={z.reviewStatus === "pending" ? "text-warn" : "text-ink-muted"}>
                      {z.reviewStatus === "pending" ? "Needs review" : "Reviewed"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(z)}
                      className="text-meta text-brand hover:text-brand-bright"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3">
        <p className="flex items-center gap-2 text-meta text-ink-muted">
          <ProvenanceBadge provenance="simulated" />
          All zones above are simulated fixtures. A hotspot is a thermal observation, not a cause label.
        </p>
      </div>

      <RiskDetailDrawer
        zone={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onMarkReviewed={(zoneId) => {
          dispatch({ type: "SET_ZONE_REVIEW", zoneId, status: "reviewed" });
          notify("Zone marked as reviewed.", "success");
          setSelected(null);
        }}
      />
    </>
  );
}
