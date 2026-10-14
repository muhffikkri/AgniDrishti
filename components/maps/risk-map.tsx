"use client";

import type { RiskZone } from "@/lib/types";
import { riskBandColor } from "@/modules/risk/risk";

const POSITIONS = [
  { x: 26, y: 24 },
  { x: 62, y: 34 },
  { x: 44, y: 52 },
  { x: 78, y: 46 },
  { x: 20, y: 48 },
];

export function RiskMap({
  zones,
  onSelectZone,
  selectedZoneId,
}: {
  zones: RiskZone[];
  onSelectZone?: (zone: RiskZone) => void;
  selectedZoneId?: string;
}) {
  return (
    <div>
      <div className="overflow-hidden rounded border border-line bg-[#0B1422]">
        <svg
          role="img"
          aria-label="Illustrative risk zone map, not for navigation"
          viewBox="0 0 100 60"
          className="h-56 w-full"
        >
          <defs>
            <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M5 0H0V5" fill="none" stroke="rgba(153,174,203,0.08)" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="60" fill="url(#grid)" />
          {zones.map((zone, i) => {
            const pos = POSITIONS[i % POSITIONS.length];
            const color = riskBandColor(zone.riskBand);
            const active = zone.id === selectedZoneId;
            return (
              <g
                key={zone.id}
                transform={`translate(${pos.x} ${pos.y})`}
                className="cursor-pointer"
                onClick={() => onSelectZone?.(zone)}
                role="button"
                aria-label={`${zone.name}, ${zone.riskBand} risk`}
              >
                <circle r={active ? 3.2 : 2.2} fill={color} opacity={active ? 0.9 : 0.7} />
                <circle r="4.6" fill="none" stroke={color} strokeWidth="0.3" opacity="0.5" />
                <text y="7" textAnchor="middle" fontSize="2" fill="#A0AEC0">
                  {zone.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <ul className="mt-2 flex flex-wrap items-center gap-3 text-meta text-ink-muted">
        {(["elevated", "moderate", "lower", "unknown"] as const).map((band) => (
          <li key={band} className="flex items-center gap-1.5 capitalize">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: riskBandColor(band) }}
            />
            {band}
          </li>
        ))}
        <li className="ml-auto text-warn">Illustrative map — not for navigation.</li>
      </ul>
    </div>
  );
}
