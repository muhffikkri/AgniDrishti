import type { TransactionStatus } from "@/lib/types";

export const ALLOWED_TRANSITIONS: Record<string, TransactionStatus[]> = {
  Draft: ["Offered", "Cancelled"],
  Offered: ["Farmer Accepted", "Rejected", "Cancelled", "Needs Review"],
  "Farmer Accepted": ["Pickup Scheduled", "Cancelled", "Needs Review"],
  "Pickup Scheduled": ["Collected / Weighed", "Cancelled", "Needs Review"],
  "Collected / Weighed": ["Payment Pending", "Needs Review"],
  "Payment Pending": ["Completed", "Disputed", "Needs Review"],
  Disputed: ["Completed", "Cancelled", "Needs Review"],
  "Needs Review": ["Offered", "Farmer Accepted", "Pickup Scheduled", "Collected / Weighed", "Payment Pending", "Completed", "Rejected", "Cancelled", "Disputed"],
  Completed: [],
  Rejected: [],
  Cancelled: [],
};

export function canTransition(from: TransactionStatus, to: TransactionStatus) {
  return (ALLOWED_TRANSITIONS[from] || []).includes(to);
}
