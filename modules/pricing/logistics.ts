import type { Buyer, ResidueRecord } from "@/lib/types";
import { computeEconomics, type Economics } from "@/modules/pricing/economics";

export const TRANSPORT_RATE_PER_TONNE_KM = 2.5;

export function estimateTransportCost(
  distanceKm: number,
  tonnes: number,
  rate = TRANSPORT_RATE_PER_TONNE_KM
) {
  return Math.round(distanceKm * tonnes * rate);
}

export interface CostInputs {
  transportCost: number;
  loadingCost: number;
  balingCost: number;
  otherKnownCosts: number;
}

export function defaultCosts(residue: ResidueRecord, buyer: Buyer): CostInputs {
  const q = residue.estimatedQuantityTonnes;
  const delivered = buyer.requirements.priceBasis === "delivered";
  return {
    transportCost: delivered ? estimateTransportCost(buyer.distanceKm, q) : 0,
    loadingCost: residue.condition === "dry" ? 0 : Math.round(150 * q),
    balingCost: residue.handlingForm === "baled" ? Math.round(250 * q) : 0,
    otherKnownCosts: 0,
  };
}

export function economicsFor(
  residue: ResidueRecord,
  buyer: Buyer,
  costs: CostInputs
): Economics {
  return computeEconomics({
    sellableQuantityTonnes: residue.estimatedQuantityTonnes,
    pricePerTonne: buyer.requirements.priceValue,
    priceBasis: buyer.requirements.priceBasis,
    transportCost: costs.transportCost,
    loadingCost: costs.loadingCost,
    balingCost: costs.balingCost,
    otherKnownCosts: costs.otherKnownCosts,
    deliveredPriceIncludesTransport: buyer.requirements.priceBasis === "delivered",
  });
}
