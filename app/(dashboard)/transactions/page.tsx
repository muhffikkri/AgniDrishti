"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/context/AppStore";
import { useToast } from "@/components/ui/toast";
import { PageHeader, EmptyState } from "@/components/ui/page";
import { StatusBadge, ProvenanceBadge } from "@/components/ui/badge";
import { TransactionDetail } from "@/components/transactions/transaction-detail";
import { formatCurrency, formatNumber } from "@/lib/format/format";
import type { TransactionStatus } from "@/lib/types";

export default function TransactionsPage() {
  const { state, dispatch } = useAppStore();
  const { notify } = useToast();
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");

  const closed: TransactionStatus[] = ["Completed", "Rejected", "Cancelled"];
  const rows = useMemo(() => {
    if (filter === "active") return state.transactions.filter((t) => !closed.includes(t.status));
    if (filter === "closed") return state.transactions.filter((t) => closed.includes(t.status));
    return state.transactions;
  }, [state.transactions, filter]);

  const open = state.transactions.find((t) => t.id === openId) ?? null;

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle="Follow each demo transaction through allowed status transitions. No real payment or collection occurs."
      />

      <div className="mb-4 flex gap-2">
        {(["all", "active", "closed"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={
              "rounded border px-3 py-1.5 text-meta capitalize " +
              (filter === f
                ? "border-brand/50 bg-brand/10 text-brand-bright"
                : "border-line text-ink-secondary hover:bg-panel")
            }
          >
            {f}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No transactions">
          Create a demo offer from the Buyer Matching page.
        </EmptyState>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-body">
            <thead className="text-meta text-ink-muted">
              <tr className="border-b border-line">
                <th className="px-3 py-2 font-medium">ID</th>
                <th className="px-3 py-2 font-medium">Residue</th>
                <th className="px-3 py-2 font-medium">Buyer</th>
                <th className="px-3 py-2 font-medium">Offer</th>
                <th className="px-3 py-2 font-medium">Est. / Measured</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => {
                const buyer = state.buyers.find((b) => b.id === t.buyerId);
                return (
                  <tr key={t.id} className="border-b border-line last:border-0 hover:bg-panel-strong">
                    <td className="px-3 py-2 font-medium">{t.id}</td>
                    <td className="px-3 py-2 text-ink-secondary">{t.residueRecordId}</td>
                    <td className="px-3 py-2 text-ink-secondary">{buyer?.name ?? t.buyerId}</td>
                    <td className="num px-3 py-2">{formatCurrency(t.offerPrice)}/t</td>
                    <td className="num px-3 py-2">
                      {formatNumber(t.estimatedQuantityTonnes)} /{" "}
                      {t.measuredQuantityTonnes === null ? "—" : formatNumber(t.measuredQuantityTonnes)}
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => setOpenId(t.id)}
                        className="text-meta text-brand hover:text-brand-bright"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3">
        <ProvenanceBadge provenance="simulated" />
      </div>

      <TransactionDetail
        tx={open}
        residue={state.residues.find((r) => r.id === open?.residueRecordId)}
        buyer={state.buyers.find((b) => b.id === open?.buyerId)}
        open={Boolean(open)}
        onClose={() => setOpenId(null)}
        onTransition={(to) => {
          if (!open) return;
          dispatch({ type: "TRANSITION", id: open.id, to, actor: "demo operator" });
          notify(`${open.id} → ${to}`, "success");
        }}
        onMeasure={(tonnes) => {
          if (!open) return;
          dispatch({ type: "RECORD_MEASUREMENT", id: open.id, measuredTonnes: tonnes });
          notify(`Measured weight recorded for ${open.id}.`, "success");
        }}
        onPay={(tonnes) => {
          if (!open) return;
          dispatch({ type: "CONFIRM_PAYMENT", id: open.id, paidTonnes: tonnes });
          notify(`Demo payment recorded for ${open.id}.`, "success");
        }}
      />
    </>
  );
}
