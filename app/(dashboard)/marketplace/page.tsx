"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/context/AppStore";
import { useToast } from "@/components/ui/toast";
import { PageHeader, EmptyState, NoMatchState } from "@/components/ui/page";
import { Card, CardHeader } from "@/components/ui/card";
import { BuyerCard } from "@/components/marketplace/buyer-card";
import { EconomicsCalculator } from "@/components/marketplace/economics-calculator";
import { rankMatches } from "@/modules/matching/rank";
import { formatNumber } from "@/lib/format/format";
import type { Transaction } from "@/lib/types";

export default function MarketplacePage() {
  const { state, dispatch } = useAppStore();
  const { notify } = useToast();

  const [residueId, setResidueId] = useState<string>(state.residues[0]?.id ?? "");
  const [buyerId, setBuyerId] = useState<string | null>(null);

  const residue = state.residues.find((r) => r.id === residueId) ?? state.residues[0];

  const matches = useMemo(
    () => (residue ? rankMatches(residue, state.buyers) : []),
    [residue, state.buyers]
  );
  const eligible = matches.filter((m) => m.eligible);
  const activeBuyer = eligible.find((m) => m.buyer.id === buyerId)?.buyer ?? eligible[0]?.buyer;

  useEffect(() => {
    setBuyerId(null);
  }, [residueId]);

  function createOffer() {
    if (!residue || !activeBuyer) return;
    const now = new Date().toISOString();
    const tx: Transaction = {
      id: `TX-${String(state.transactions.length + 1).padStart(3, "0")}`,
      residueRecordId: residue.id,
      buyerId: activeBuyer.id,
      offerPrice: activeBuyer.requirements.priceValue,
      currency: activeBuyer.requirements.priceCurrency,
      estimatedQuantityTonnes: residue.estimatedQuantityTonnes,
      measuredQuantityTonnes: null,
      acceptedQuantityTonnes: 0,
      paidQuantityTonnes: 0,
      status: "Offered",
      pickupScheduledAt: null,
      collectedAt: null,
      paymentConfirmedAt: null,
      provenance: "simulated",
      events: [
        {
          fromStatus: null,
          toStatus: "Draft",
          timestamp: now,
          actor: "demo operator",
          note: "Demo transaction created",
          provenance: "simulated",
        },
        {
          fromStatus: "Draft",
          toStatus: "Offered",
          timestamp: now,
          actor: "demo operator",
          note: "Offer prepared in demo — not a real agreement",
          provenance: "simulated",
        },
      ],
    };
    dispatch({ type: "ADD_TRANSACTION", transaction: tx });
    notify(`Demo offer ${tx.id} created for ${activeBuyer.name}.`, "success");
  }

  return (
    <>
      <PageHeader
        title="Buyer Matching"
        subtitle="Compare eligible buyers against material and logistics constraints. A match is a candidate until terms are confirmed."
      />

      {state.residues.length === 0 || !residue ? (
        <EmptyState title="No residue to match">
          Register residue first in the Residue Registry.
        </EmptyState>
      ) : (
        <>
          <Card className="mb-4">
            <CardHeader title="Select residue to match" />
            <select
              aria-label="Select residue record"
              value={residue.id}
              onChange={(e) => setResidueId(e.target.value)}
              className="w-full rounded border border-line bg-field px-3 py-2 text-body text-ink-primary sm:max-w-md"
            >
              {state.residues.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} · {r.residueType} · {formatNumber(r.estimatedQuantityTonnes)} t ·{" "}
                  {r.availableFrom}→{r.availableUntil}
                </option>
              ))}
            </select>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="flex flex-col gap-3 lg:col-span-2">
              <h2 className="eyebrow">Buyer candidates</h2>
              {matches.map((m) => (
                <BuyerCard
                  key={m.buyer.id}
                  match={m}
                  selected={activeBuyer?.id === m.buyer.id}
                  onSelect={() => setBuyerId(m.buyer.id)}
                />
              ))}
            </div>

            <div className="lg:col-span-1">
              {activeBuyer ? (
                <div className="flex flex-col gap-3">
                  <EconomicsCalculator
                    residue={residue}
                    buyer={activeBuyer}
                    onCreateOffer={createOffer}
                  />
                  <Link
                    href="/transactions"
                    className="text-center text-meta text-brand hover:text-brand-bright"
                  >
                    Go to transactions
                  </Link>
                </div>
              ) : (
                <NoMatchState title="No viable match">
                  No buyer currently satisfies the hard constraints for this residue. Adjust the
                  residue type, condition, handling form, quantity, or availability window, or add a
                  buyer requirement that accepts it.
                </NoMatchState>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
