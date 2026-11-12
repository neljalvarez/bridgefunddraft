"use client";

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { chartTheme } from "@/config/chart-theme";
import type { ChartDatum } from "@/types";

/** Client-only Recharts line chart. Fills its parent's height. */
export function LineChart({ data }: { data: ChartDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
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
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke={chartTheme.primary}
          strokeWidth={2.5}
          dot={{ r: 3, fill: chartTheme.primary }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
