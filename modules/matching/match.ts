import type { Buyer, ResidueRecord } from "@/lib/types";

export interface Blocker {
  reason: string;
}

export interface MatchResult {
  eligible: boolean;
  blockers: string[];
  needInformation: string[];
}

export function evaluateMatch(residue: ResidueRecord, buyer: Buyer): MatchResult {
  const blockers: string[] = [];
  const needInformation: string[] = [];

  if (!buyer.activeStatus) {
    blockers.push("Buyer inactive");
  }

  if (!buyer.requirements.acceptedResidueTypes.includes(residue.residueType)) {
    blockers.push(`Residue type ${residue.residueType} not accepted`);
  }

  if (!buyer.requirements.acceptedConditions.includes(residue.condition)) {
    blockers.push(`Condition ${residue.condition} not accepted`);
  }

  if (!buyer.requirements.acceptedHandlingForms.includes(residue.handlingForm)) {
    blockers.push(`Handling ${residue.handlingForm} not accepted`);
  }

  if (residue.estimatedQuantityTonnes < buyer.requirements.minimumVolumeTonnes) {
    blockers.push("Quantity below minimum volume");
  }

  if (residue.estimatedQuantityTonnes > buyer.requirements.maximumVolumeTonnes) {
    blockers.push("Quantity exceeds maximum volume");
  }

  const rFrom = new Date(residue.availableFrom).getTime();
  const rTo = new Date(residue.availableUntil).getTime();
  const bFrom = new Date(buyer.requirements.validFrom).getTime();
  const bTo = new Date(buyer.requirements.validUntil).getTime();

  if (rFrom > bTo || rTo < bFrom) {
    blockers.push("Availability window incompatible");
  }

  if (buyer.requirements.priceBasis === "unknown") {
    needInformation.push("Price basis not specified");
  }

  return {
    eligible: blockers.length === 0,
    blockers,
    needInformation,
  };
}
