import type { ResidueRecord } from "@/lib/types";

export interface ResidueFormErrors {
  [key: string]: string | undefined;
}

export interface ResidueFormInput {
  farmerId?: string;
  zoneId: string;
  cropType: string;
  residueType: string;
  fieldAreaValue: number;
  fieldAreaUnit: string;
  harvestDate: string;
  condition: string;
  handlingForm: string;
  estimatedQuantityTonnes: number;
  availableFrom: string;
  availableUntil: string;
  notes?: string;
}

const COND = ["dry", "slightly_damp", "wet"];
const FORM = ["loose", "baled", "chopped"];

export function validateResidueForm(input: ResidueFormInput): ResidueFormErrors {
  const errors: ResidueFormErrors = {};

  if (!input.zoneId) errors.zoneId = "Zone is required.";
  if (!input.cropType) errors.cropType = "Crop type is required.";
  if (!input.residueType) errors.residueType = "Residue type is required.";

  if (!isFinite(input.fieldAreaValue) || input.fieldAreaValue <= 0) {
    errors.fieldAreaValue = "Field area must be a positive number.";
  }

  if (!isFinite(input.estimatedQuantityTonnes) || input.estimatedQuantityTonnes <= 0) {
    errors.estimatedQuantityTonnes = "Estimated quantity must be a positive number.";
  }

  if (!input.harvestDate || isNaN(new Date(input.harvestDate).getTime())) {
    errors.harvestDate = "A valid harvest date is required.";
  }

  if (!input.availableFrom || isNaN(new Date(input.availableFrom).getTime())) {
    errors.availableFrom = "A valid availability start date is required.";
  }

  if (!input.availableUntil || isNaN(new Date(input.availableUntil).getTime())) {
    errors.availableUntil = "A valid availability end date is required.";
  }

  if (
    input.availableFrom &&
    input.availableUntil &&
    new Date(input.availableFrom) > new Date(input.availableUntil)
  ) {
    errors.availableUntil = "End date must be on or after the start date.";
  }

  if (!COND.includes(input.condition)) errors.condition = "Select a valid condition.";
  if (!FORM.includes(input.handlingForm)) errors.handlingForm = "Select a valid handling form.";

  return errors;
}

export function hasErrors(errors: ResidueFormErrors) {
  return Object.values(errors).some(Boolean);
}
