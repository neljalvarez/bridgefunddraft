"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { chartTheme } from "@/config/chart-theme";
import type { ChartDatum } from "@/types";

/** Client-only Recharts bar chart. Fills its parent's height. */
export function BarChart({ data }: { data: ChartDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
      >
        <CartesianGrid vertical={false} stroke={chartTheme.grid} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: chartTheme.axis, fontSize: 12 }}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: chartTheme.axis, fontSize: 12 }}
        />
        <Tooltip cursor={{ fill: "#F1F5F9" }} />
        <Bar dataKey="value" fill={chartTheme.primary} radius={[6, 6, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
