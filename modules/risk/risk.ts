import type { RiskBand } from "@/lib/types";

export function riskBandLabel(band: RiskBand) {
  return {
    elevated: "Elevated risk",
    moderate: "Moderate risk",
    lower: "Lower risk",
    unknown: "Unknown",
  }[band];
}

export function riskBandClasses(band: RiskBand) {
  return {
    elevated: "bg-risk-elevated/15 text-risk-elevated border-risk-elevated/30",
    moderate: "bg-risk-moderate/15 text-risk-moderate border-risk-moderate/30",
    lower: "bg-risk-lower/15 text-risk-lower border-risk-lower/30",
    unknown: "bg-line text-ink-muted border-line",
  }[band];
}

export function riskBandColor(band: RiskBand) {
  return {
    elevated: "#F6A623",
    moderate: "#70A8FF",
    lower: "#39C79A",
    unknown: "#8493A8",
  }[band];
}

export function bandFromScore(score: number): RiskBand {
  if (score >= 0.7) return "elevated";
  if (score >= 0.4) return "moderate";
  return "lower";
}

export function recommendedAction(band: RiskBand): string {
  return {
    elevated: "Prioritise preventive outreach and confirm context with a field partner.",
    moderate: "Schedule outreach and monitor the next assessment horizon.",
    lower: "Routine monitoring only.",
    unknown: "Collect additional data before making a risk assessment.",
  }[band];
}
