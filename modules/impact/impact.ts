import type { ResidueRecord, Transaction } from "@/lib/types";

export interface ImpactSummary {
  registeredTonnes: number;
  verifiedTonnes: number;
  collectedTonnes: number;
  soldTonnes: number;
  activeTransactions: number;
  completedTransactions: number;
  completionRate: number;
  indicativeFarmerNet: number;
  likelyDivertedTonnes: number | null;
  estimatedAvoidedEmissions: number | null;
  emissionsUnit: string;
  notes: string[];
}

const COMPLETED = "Completed";
const CLOSED: Transaction["status"][] = ["Completed", "Rejected", "Cancelled"];

export function computeImpact(
  residues: ResidueRecord[],
  transactions: Transaction[]
): ImpactSummary {
  const registeredTonnes = sum(residues, (r) => r.estimatedQuantityTonnes);
  const verifiedTonnes = sum(
    residues.filter((r) => r.verificationStatus === "verified"),
    (r) => r.estimatedQuantityTonnes
  );

  const collectedTransactions = transactions.filter(
    (t) => t.status === "Collected / Weighed" || t.status === "Payment Pending" || t.status === "Completed"
  );
  const collectedTonnes = sum(collectedTransactions, (t) => t.measuredQuantityTonnes ?? 0);

  const soldTransactions = transactions.filter((t) => t.status === COMPLETED);
  const soldTonnes = sum(soldTransactions, (t) => t.paidQuantityTonnes || t.acceptedQuantityTonnes || 0);

  const completed = transactions.filter((t) => t.status === COMPLETED).length;
  const closed = transactions.filter((t) => CLOSED.includes(t.status)).length;

  const indicativeFarmerNet = sum(soldTransactions, (t) =>
    (t.paidQuantityTonnes || t.acceptedQuantityTonnes || 0) * t.offerPrice
  );

  return {
    registeredTonnes,
    verifiedTonnes,
    collectedTonnes,
    soldTonnes,
    activeTransactions: transactions.length - closed,
    completedTransactions: completed,
    completionRate: closed > 0 ? completed / closed : 0,
    indicativeFarmerNet,
    likelyDivertedTonnes: null,
    estimatedAvoidedEmissions: null,
    emissionsUnit: "tCO2e",
    notes: [
      "Collected mass is not automatically mass diverted from burning.",
      "Avoided emissions are not estimated: no documented counterfactual or emission factor is available.",
      "Farmer net figures are indicative and may omit costs.",
    ],
  };
}

function sum<T>(items: T[], pick: (t: T) => number) {
  return items.reduce((acc, t) => acc + (pick(t) || 0), 0);
}
