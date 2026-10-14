import type { Buyer, ResidueRecord } from "@/lib/types";
import { evaluateMatch, type MatchResult } from "@/modules/matching/match";

export interface RankedMatch extends MatchResult {
  buyer: Buyer;
}

export function rankMatches(residue: ResidueRecord, buyers: Buyer[]): RankedMatch[] {
  return buyers
    .map((buyer) => ({ buyer, ...evaluateMatch(residue, buyer) }))
    .sort((a, b) => Number(b.eligible) - Number(a.eligible));
}

export function eligibleMatches(residue: ResidueRecord, buyers: Buyer[]) {
  return rankMatches(residue, buyers).filter((m) => m.eligible);
}
