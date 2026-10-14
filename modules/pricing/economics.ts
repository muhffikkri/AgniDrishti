export interface Economics {
  sellableQuantityTonnes: number;
  grossValue: number;
  transportCost: number;
  loadingCost: number;
  balingCost: number;
  otherKnownCosts: number;
  knownCosts: number;
  indicativeNetProceeds: number;
  missingCosts: string[];
  pricePerTonne: number;
}

export interface EconomicsInput {
  sellableQuantityTonnes: number;
  pricePerTonne: number;
  priceBasis: "farm-gate" | "delivered" | "ex-works" | "unknown";
  transportCost: number;
  loadingCost: number;
  balingCost: number;
  otherKnownCosts: number;
  deliveredPriceIncludesTransport?: boolean;
}

export function computeEconomics(input: EconomicsInput): Economics {
  const {
    sellableQuantityTonnes,
    pricePerTonne,
    priceBasis,
    transportCost,
    loadingCost,
    balingCost,
    otherKnownCosts,
    deliveredPriceIncludesTransport,
  } = input;

  const q = Math.max(0, sellableQuantityTonnes || 0);
  const p = Math.max(0, pricePerTonne || 0);

  const grossValue = q * p;

  let transport = transportCost || 0;
  if (priceBasis === "delivered" && deliveredPriceIncludesTransport) {
    transport = 0;
  }

  const knownCosts = transport + (loadingCost || 0) + (balingCost || 0) + (otherKnownCosts || 0);
  const indicativeNetProceeds = grossValue - knownCosts;

  const missingCosts: string[] = [];
  if (priceBasis === "unknown") missingCosts.push("price basis");
  if (transport <= 0 && priceBasis !== "delivered" && (loadingCost + balingCost + otherKnownCosts) === 0) {
    missingCosts.push("logistics costs");
  }

  return {
    sellableQuantityTonnes: q,
    grossValue,
    transportCost: transport,
    loadingCost: loadingCost || 0,
    balingCost: balingCost || 0,
    otherKnownCosts: otherKnownCosts || 0,
    knownCosts,
    indicativeNetProceeds,
    missingCosts,
    pricePerTonne: p,
  };
}
