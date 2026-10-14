import type { Provenance } from "@/lib/types";

export interface DataSourceEntry {
  source: string;
  intendedUse: string;
  limitations: string;
  status: string;
  provenance: Provenance;
}

export const DATA_SOURCES: DataSourceEntry[] = [
  {
    source: "NASA FIRMS VIIRS / MODIS",
    intendedUse: "Active-fire and thermal-anomaly screening layer.",
    limitations: "A thermal anomaly is not a crop/type label and clouds can hide detections.",
    status: "Documentation located; not ingested in this prototype.",
    provenance: "simulated",
  },
  {
    source: "Sentinel-2 optical imagery",
    intendedUse: "Land-cover and vegetation context around harvest.",
    limitations: "Cloud cover and revisit gaps; imagery alone cannot establish fire cause.",
    status: "Planned; not ingested in this prototype.",
    provenance: "simulated",
  },
  {
    source: "Official Indian agricultural statistics",
    intendedUse: "Crop area and production context for candidate regions.",
    limitations: "District completeness and reporting status vary.",
    status: "Planned; not ingested in this prototype.",
    provenance: "simulated",
  },
  {
    source: "Historical weather / reanalysis",
    intendedUse: "Temporal context for risk assessment.",
    limitations: "Reanalysis is coarse relative to an individual field.",
    status: "Planned; not ingested in this prototype.",
    provenance: "simulated",
  },
  {
    source: "Buyer listings and leads",
    intendedUse: "Discover potential residue buyers and requirements.",
    limitations: "A listing is not a confirmed purchase commitment.",
    status: "Illustrative only in this prototype.",
    provenance: "simulated",
  },
  {
    source: "Farmer / field validation sample",
    intendedUse: "Validate attribution, estimates and unit economics.",
    limitations: "Requires consent, careful sampling and time.",
    status: "Not collected for this prototype.",
    provenance: "simulated",
  },
];

export const METHOD_LIMITATIONS: string[] = [
  "Collected mass is not automatically equated with mass diverted from burning.",
  "Avoided emissions are not estimated: no documented counterfactual and no suitable emission factors are applied.",
  "Risk scores are illustrative priorities with a defined horizon and method version, not calibrated probabilities.",
  "Buyer prices are indicative and unverified; they are not guaranteed or current quotes.",
  "Model performance is not displayed as a result; no valid evaluation has been performed.",
];
