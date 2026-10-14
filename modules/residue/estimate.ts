import type { ResidueRecord } from "@/lib/types";

export interface ResidueEstimateInput {
  fieldAreaValue: number;
  fieldAreaUnit: string;
  yieldPerAcreTonnes: number;
}

export interface ResidueEstimate {
  estimatedQuantityTonnes: number;
  formula: string;
  assumptions: string[];
}

export const ACRE_TO_HA = 0.404686;

export function toAcres(value: number, unit: string): number {
  if (unit === "ha") return value / ACRE_TO_HA;
  return value;
}

export function estimateResidue(input: ResidueEstimateInput): ResidueEstimate {
  const acres = toAcres(input.fieldAreaValue, input.fieldAreaUnit);
  const estimatedQuantityTonnes = acres * input.yieldPerAcreTonnes;
  return {
    estimatedQuantityTonnes: Math.round(estimatedQuantityTonnes * 100) / 100,
    formula: "estimated quantity = field area (acres) × assumed residue yield (t/acre)",
    assumptions: [
      "Residue yield per acre is an illustrative assumption, not a measured value.",
      "A photograph is not treated as a precise mass or moisture measurement.",
    ],
  };
}

export function isResidueQuantityValid(q: number) {
  return isFinite(q) && q > 0;
}
