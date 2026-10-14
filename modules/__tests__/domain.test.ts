import { describe, it, expect } from "vitest";
import { computeEconomics } from "@/modules/pricing/economics";
import { evaluateMatch } from "@/modules/matching/match";
import { canTransition } from "@/modules/transactions/state";
import type { Buyer, ResidueRecord } from "@/lib/types";

const residue = (over: Partial<ResidueRecord> = {}): ResidueRecord => ({
  id: "R",
  zoneId: "ZONE-001",
  cropType: "wheat",
  residueType: "straw",
  fieldAreaValue: 10,
  fieldAreaUnit: "acres",
  harvestDate: "2026-10-05",
  condition: "dry",
  handlingForm: "loose",
  estimatedQuantityTonnes: 6,
  measuredQuantityTonnes: null,
  availableFrom: "2026-10-07",
  availableUntil: "2026-10-17",
  verificationStatus: "unverified",
  provenance: "simulated",
  ...over,
});

const buyer = (over: Partial<Buyer> = {}): Buyer => ({
  id: "B",
  name: "Test",
  buyerType: "local_fodder",
  location: "X",
  serviceArea: "ZONE-001",
  activeStatus: true,
  verificationStatus: "unverified",
  provenance: "simulated",
  requirements: {
    acceptedResidueTypes: ["straw"],
    minimumVolumeTonnes: 5,
    maximumVolumeTonnes: 20,
    acceptedConditions: ["dry"],
    acceptedHandlingForms: ["loose"],
    priceValue: 1200,
    priceCurrency: "INR",
    priceUnit: "tonne",
    priceBasis: "farm-gate",
    validFrom: "2026-10-01",
    validUntil: "2026-10-30",
  },
  ...over,
});

describe("economics", () => {
  it("computes gross value and flags missing logistics", () => {
    const r = computeEconomics({
      sellableQuantityTonnes: 6,
      pricePerTonne: 1200,
      priceBasis: "farm-gate",
      transportCost: 0,
      loadingCost: 0,
      balingCost: 0,
      otherKnownCosts: 0,
    });
    expect(r.grossValue).toBe(7200);
    expect(r.indicativeNetProceeds).toBe(7200);
    expect(r.missingCosts).toContain("logistics costs");
  });

  it("does not double-count transport on a delivered quote", () => {
    const r = computeEconomics({
      sellableQuantityTonnes: 6,
      pricePerTonne: 1500,
      priceBasis: "delivered",
      transportCost: 500,
      loadingCost: 0,
      balingCost: 0,
      otherKnownCosts: 0,
      deliveredPriceIncludesTransport: true,
    });
    expect(r.transportCost).toBe(0);
    expect(r.indicativeNetProceeds).toBe(9000);
  });

  it("keeps deductions visible in net proceeds", () => {
    const r = computeEconomics({
      sellableQuantityTonnes: 6,
      pricePerTonne: 1200,
      priceBasis: "farm-gate",
      transportCost: 1000,
      loadingCost: 500,
      balingCost: 0,
      otherKnownCosts: 0,
    });
    expect(r.indicativeNetProceeds).toBe(5700);
  });
});

describe("matching", () => {
  it("marks a compatible buyer eligible", () => {
    expect(evaluateMatch(residue(), buyer()).eligible).toBe(true);
  });

  it("returns a no-match blocker when quantity is too low", () => {
    const m = evaluateMatch(residue({ estimatedQuantityTonnes: 1 }), buyer());
    expect(m.eligible).toBe(false);
    expect(m.blockers.length).toBeGreaterThan(0);
  });

  it("blocks when the buyer is inactive", () => {
    expect(evaluateMatch(residue(), buyer({ activeStatus: false })).eligible).toBe(false);
  });
});

describe("transactions", () => {
  it("permits only allowed transitions", () => {
    expect(canTransition("Draft", "Offered")).toBe(true);
    expect(canTransition("Offered", "Completed")).toBe(false);
    expect(canTransition("Offered", "Farmer Accepted")).toBe(true);
  });
});
