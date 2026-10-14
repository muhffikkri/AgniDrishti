"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ResidueRecord, RiskZone } from "@/lib/types";
import { riskBandColor } from "@/modules/risk/risk";

const axis = { stroke: "#8493A8", fontSize: 11 };

export function RiskScoreChart({ zones }: { zones: RiskZone[] }) {
  const data = zones.map((z) => ({
    name: z.id,
    score: Math.round(z.riskScore * 100),
    band: z.riskBand,
  }));

  return (
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="rgba(153,174,203,0.1)" vertical={false} />
          <XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false} />
          <YAxis
            tick={axis}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip
            contentStyle={{
              background: "#101A2B",
              border: "1px solid rgba(153,174,203,0.13)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#E8EEF7" }}
            formatter={(v: number) => [`${v}%`, "Risk score (illustrative)"]}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.name} fill={riskBandColor(d.band)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ResidueFlowChart({
  registered,
  verified,
  collected,
  sold,
}: {
  registered: number;
  verified: number;
  collected: number;
  sold: number;
}) {
  const data = [
    { name: "Registered", value: registered, fill: "#70A8FF" },
    { name: "Verified", value: verified, fill: "#5DDBAC" },
    { name: "Collected", value: collected, fill: "#39C79A" },
    { name: "Sold", value: sold, fill: "#F6A623" },
  ];

  return (
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="rgba(153,174,203,0.1)" vertical={false} />
          <XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false} />
          <YAxis tick={axis} axisLine={false} tickLine={false} unit=" t" />
          <Tooltip
            contentStyle={{
              background: "#101A2B",
              border: "1px solid rgba(153,174,203,0.13)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#E8EEF7" }}
            formatter={(v: number) => [`${v} t`, "Mass"]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
