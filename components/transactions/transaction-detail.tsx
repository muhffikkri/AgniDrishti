"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge, ProvenanceBadge } from "@/components/ui/badge";
import { Field, Input } from "@/components/ui/field";
import { ALLOWED_TRANSITIONS } from "@/modules/transactions/state";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format/format";
import type { Buyer, ResidueRecord, Transaction, TransactionStatus } from "@/lib/types";

export function TransactionDetail({
  tx,
  residue,
  buyer,
  open,
  onClose,
  onTransition,
  onMeasure,
  onPay,
}: {
  tx: Transaction | null;
  residue?: ResidueRecord;
  buyer?: Buyer;
  open: boolean;
  onClose: () => void;
  onTransition: (to: TransactionStatus) => void;
  onMeasure: (tonnes: number) => void;
  onPay: (tonnes: number) => void;
}) {
  const [measured, setMeasured] = useState("");
  const [paid, setPaid] = useState("");

  if (!tx) return null;

  const next = ALLOWED_TRANSITIONS[tx.status] ?? [];
  const showMeasure =
    ["Pickup Scheduled", "Collected / Weighed", "Payment Pending"].includes(tx.status) &&
    tx.measuredQuantityTonnes === null;
  const showPayment = tx.status === "Payment Pending";

  const reverseTransitions: TransactionStatus[] = ["Rejected", "Cancelled", "Needs Review", "Disputed"];

  return (
    <Drawer open={open} onClose={onClose} title={`Transaction ${tx.id}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={tx.status} />
          <ProvenanceBadge provenance={tx.provenance} />
          <Badge>Demo transaction</Badge>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-body">
          <dt className="text-ink-muted">Residue</dt>
          <dd className="text-right">{residue?.id ?? "—"}</dd>
          <dt className="text-ink-muted">Buyer</dt>
          <dd className="text-right">{buyer?.name ?? "—"}</dd>
          <dt className="text-ink-muted">Offered price</dt>
          <dd className="num text-right">{formatCurrency(tx.offerPrice)}/t</dd>
          <dt className="text-ink-muted">Estimated quantity</dt>
          <dd className="num text-right">{formatNumber(tx.estimatedQuantityTonnes)} t</dd>
          <dt className="text-ink-muted">Measured quantity</dt>
          <dd className="num text-right">
            {tx.measuredQuantityTonnes === null ? "Not measured" : `${formatNumber(tx.measuredQuantityTonnes)} t`}
          </dd>
          <dt className="text-ink-muted">Accepted quantity</dt>
          <dd className="num text-right">{formatNumber(tx.acceptedQuantityTonnes)} t</dd>
          <dt className="text-ink-muted">Paid quantity</dt>
          <dd className="num text-right">{formatNumber(tx.paidQuantityTonnes)} t</dd>
          <dt className="text-ink-muted">Pickup</dt>
          <dd className="text-right">{tx.pickupScheduledAt ? formatDateTime(tx.pickupScheduledAt) : "—"}</dd>
        </dl>

        {showMeasure ? (
          <section className="rounded border border-line bg-field p-3">
            <h3 className="eyebrow mb-2">Record measured weight</h3>
            <p className="mb-2 text-meta text-ink-muted">
              Measured is stored separately from the original estimate.
            </p>
            <div className="flex items-end gap-2">
              <Field label="Measured (t)" htmlFor="measured">
                <Input
                  id="measured"
                  type="number"
                  min="0"
                  step="0.01"
                  value={measured}
                  onChange={(e) => setMeasured(e.target.value)}
                />
              </Field>
              <Button
                variant="secondary"
                onClick={() => {
                  const v = Number(measured);
                  if (v > 0) onMeasure(v);
                }}
              >
                Save
              </Button>
            </div>
          </section>
        ) : null}

        {showPayment ? (
          <section className="rounded border border-line bg-field p-3">
            <h3 className="eyebrow mb-2">Confirm payment (demo)</h3>
            <div className="flex items-end gap-2">
              <Field label="Paid (t)" htmlFor="paid">
                <Input
                  id="paid"
                  type="number"
                  min="0"
                  step="0.01"
                  value={paid}
                  onChange={(e) => setPaid(e.target.value)}
                />
              </Field>
              <Button
                variant="secondary"
                onClick={() => {
                  const v = Number(paid);
                  if (v > 0) onPay(v);
                }}
              >
                Confirm
              </Button>
            </div>
            <p className="mt-2 text-meta text-warn">
              Demo completion does not represent a real payment.
            </p>
          </section>
        ) : null}

        <section>
          <h3 className="eyebrow mb-2">Allowed transitions</h3>
          <div className="flex flex-wrap gap-2">
            {next.length === 0 ? (
              <p className="text-meta text-ink-muted">This transaction is in a terminal state.</p>
            ) : (
              next.map((to) => (
                <Button
                  key={to}
                  variant={reverseTransitions.includes(to) ? "secondary" : "primary"}
                  onClick={() => onTransition(to)}
                >
                  {to}
                </Button>
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="eyebrow mb-2">Event history</h3>
          <ol className="relative ml-2 border-l border-line pl-4">
            {tx.events.map((e, i) => (
              <li key={i} className="mb-3 last:mb-0">
                <span className="absolute -left-[5px] mt-1.5 h-2 w-2 rounded-full bg-brand" />
                <p className="text-body">
                  {e.fromStatus ? `${e.fromStatus} → ` : ""}
                  <span className="font-medium">{e.toStatus}</span>
                </p>
                <p className="text-meta text-ink-muted">
                  {formatDateTime(e.timestamp)} · {e.actor}
                  {e.note ? ` · ${e.note}` : ""}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Drawer>
  );
}
