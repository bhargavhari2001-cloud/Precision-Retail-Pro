"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import type { ForecastPoint } from "@/types";

interface Props {
  points: ForecastPoint[];
  sku: string;
  currentStock?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CyberTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-cyan-500/40 bg-black/90 p-3 shadow-[0_0_16px_rgba(0,255,255,0.2)] backdrop-blur-sm">
      <p className="mb-1 font-mono text-[10px] text-cyan-400">{label}</p>
      {payload.map((item: { name: string; value: number | null; color: string }, i: number) =>
        item.value !== null ? (
          <p key={i} className="font-mono text-xs" style={{ color: item.color }}>
            {item.name}: <span className="font-bold">{item.value}</span>
          </p>
        ) : null
      )}
    </div>
  );
};

export default function ForecastChart({ points, sku, currentStock }: Props) {
  const data = points.map((p) => ({
    date: p.date,
    historical: p.type === "Historical" ? p.value : null,
    predicted: p.type === "Predicted" ? p.value : null,
  }));

  const tickStep = Math.max(1, Math.floor(data.length / 8));

  return (
    <div className="rounded-lg border border-cyan-500/20 bg-black/70 p-5 shadow-[0_0_24px_rgba(0,255,255,0.08)] backdrop-blur-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/40 to-transparent" />
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
          Demand Forecast /{" "}
          <span className="text-purple-300">{sku}</span>
        </p>
        <div className="h-px flex-1 bg-gradient-to-l from-cyan-500/40 to-transparent" />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="2 4" stroke="#0e7490" strokeOpacity={0.3} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#06b6d4", fontSize: 10, fontFamily: "monospace" }}
            tickLine={false}
            axisLine={{ stroke: "#0e7490", strokeOpacity: 0.4 }}
            interval={tickStep - 1}
          />
          <YAxis
            tick={{ fill: "#06b6d4", fontSize: 10, fontFamily: "monospace" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CyberTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, fontFamily: "monospace", color: "#67e8f9" }}
          />

          <Area
            type="monotone"
            dataKey="historical"
            name="Historical"
            stroke="#06b6d4"
            strokeWidth={1.5}
            fill="url(#historicalGrad)"
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="predicted"
            name="AI Forecast"
            stroke="#a855f7"
            strokeWidth={2.5}
            strokeDasharray="8 4"
            dot={false}
            connectNulls
          />

          {currentStock !== undefined && (
            <ReferenceLine
              y={currentStock}
              stroke="#fbbf24"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              label={{
                value: `STOCK: ${currentStock}`,
                fill: "#fbbf24",
                fontSize: 9,
                fontFamily: "monospace",
                position: "insideTopRight",
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
