export type Provenance = "simulated" | "observed" | "derived" | "verified";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected" | "needs_review";
export type RiskBand = "lower" | "moderate" | "elevated" | "unknown";
export type QuantityUnit = "tonnes" | "acres";

export interface FixtureMetadata {
  mode: "simulated";
  region: string;
  asOf: string;
  warning: string;
}

export interface RiskZone {
  id: string;
  name: string;
  adminRegion: string;
  riskScore: number;
  riskBand: RiskBand;
  provenance: Provenance;
  methodVersion: string;
  horizonStart: string;
  horizonEnd: string;
  uncertainty: "low" | "medium" | "high";
  reviewStatus: "pending" | "reviewed";
  cropContext: string;
}

export interface ResidueRecord {
  id: string;
  farmerId?: string;
  zoneId: string;
  cropType: string;
  residueType: string;
  fieldAreaValue: number;
  fieldAreaUnit: QuantityUnit | "acres" | "ha";
  harvestDate: string;
  condition: "dry" | "slightly_damp" | "wet";
  handlingForm: "loose" | "baled" | "chopped";
  estimatedQuantityTonnes: number;
  measuredQuantityTonnes: number | null;
  availableFrom: string;
  availableUntil: string;
  photoAssetIds?: string[];
  verificationStatus: VerificationStatus;
  provenance: Provenance;
  notes?: string;
}

export interface BuyerRequirement {
  acceptedResidueTypes: string[];
  minimumVolumeTonnes: number;
  maximumVolumeTonnes: number;
  acceptedConditions: string[];
  acceptedHandlingForms: string[];
  maximumMoisturePct?: number;
  priceValue: number;
  priceCurrency: string;
  priceUnit: string;
  priceBasis: "farm-gate" | "delivered" | "ex-works" | "unknown";
  validFrom: string;
  validUntil: string;
  pickupTerms?: string;
}

export interface Buyer {
  id: string;
  name: string;
  buyerType: "local_fodder" | "aggregator" | "biomass_processor" | "industrial_user";
  location: string;
  serviceArea: string;
  activeStatus: boolean;
  verificationStatus: VerificationStatus;
  provenance: Provenance;
  requirements: BuyerRequirement;
}

export interface TransactionEvent {
  fromStatus: string | null;
  toStatus: string;
  timestamp: string;
  actor: string;
  note?: string;
  evidenceAssetIds?: string[];
  provenance: Provenance;
}

export type TransactionStatus =
  | "Draft"
  | "Offered"
  | "Farmer Accepted"
  | "Pickup Scheduled"
  | "Collected / Weighed"
  | "Payment Pending"
  | "Completed"
  | "Rejected"
  | "Cancelled"
  | "Disputed"
  | "Needs Review";

export interface Transaction {
  id: string;
  residueRecordId: string;
  buyerId: string;
  offerPrice: number;
  currency: string;
  estimatedQuantityTonnes: number;
  measuredQuantityTonnes: number | null;
  acceptedQuantityTonnes: number;
  paidQuantityTonnes: number;
  status: TransactionStatus;
  pickupScheduledAt: string | null;
  collectedAt: string | null;
  paymentConfirmedAt: string | null;
  provenance: Provenance;
  events: TransactionEvent[];
}

export interface LogisticsEstimate {
  id: string;
  residueRecordId: string;
  buyerId: string;
  distanceKm: number;
  transportCost: number;
  loadingCost: number;
  balingCost: number;
  otherCosts: number;
  calculationVersion: string;
  provenance: Provenance;
}

export interface MatchCandidate {
  id: string;
  residueRecordId: string;
  buyerId: string;
  eligibilityStatus: "eligible" | "ineligible" | "needs_information";
  blockers: string[];
  estimatedGrossValue: number;
  estimatedTotalKnownCost: number;
  estimatedFarmerNet: number;
  alternativeUseBaseline?: number;
  calculationVersion: string;
  provenance: Provenance;
}

export interface Dataset {
  metadata: FixtureMetadata;
  riskZones: RiskZone[];
  residues: ResidueRecord[];
  buyers: Buyer[];
  transactions: Transaction[];
  logistics: LogisticsEstimate[];
  matches?: MatchCandidate[];
}
