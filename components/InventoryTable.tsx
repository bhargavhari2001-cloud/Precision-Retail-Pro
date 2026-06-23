"use client";

import type { InventoryMetric } from "@/types";

const statusBadge: Record<string, string> = {
  "Urgent Reorder": "bg-red-500/10 text-red-300 border border-red-500/50 shadow-[0_0_8px_rgba(248,113,113,0.2)]",
  "Dead Stock":     "bg-amber-500/10 text-amber-300 border border-amber-500/50 shadow-[0_0_8px_rgba(251,191,36,0.2)]",
  Healthy:          "bg-cyan-500/10 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(0,255,255,0.15)]",
};

const abcBadge: Record<string, string> = {
  A: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
  B: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(0,255,255,0.15)]",
  C: "bg-zinc-700/20 text-zinc-400 border border-zinc-600/50",
};

const dsiColor = (dsi: number) => {
  if (dsi < 14) return "text-red-400 drop-shadow-[0_0_4px_rgba(248,113,113,0.6)]";
  if (dsi > 90) return "text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]";
  return "text-cyan-400 drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]";
};

interface Props {
  metrics: InventoryMetric[];
}

const HEADERS = ["SKU", "ABC", "Stock", "Cost", "Price", "Avg Demand/day", "DSI", "Status", "Cash Trapped", "Method"];

export default function InventoryTable({ metrics }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-cyan-500/20 shadow-[0_0_24px_rgba(0,255,255,0.06)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cyan-500/20 bg-black/80">
            {HEADERS.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-cyan-500/70">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((m, i) => (
            <tr
              key={m.SKU}
              className={`border-b border-cyan-900/30 transition-colors hover:bg-cyan-500/5 ${
                i % 2 === 0 ? "bg-black/40" : "bg-black/20"
              }`}
            >
              <td className="px-4 py-3 font-mono font-bold text-cyan-300">{m.SKU}</td>
              <td className="px-4 py-3">
                {m.ABC_Class ? (
                  <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${abcBadge[m.ABC_Class]}`}>
                    {m.ABC_Class}
                  </span>
                ) : (
                  <span className="font-mono text-zinc-700">—</span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-zinc-300">{m.Current_Stock.toLocaleString()}</td>
              <td className="px-4 py-3 font-mono text-zinc-400">${m.Cost.toFixed(2)}</td>
              <td className="px-4 py-3 font-mono text-zinc-400">${m.Price.toFixed(2)}</td>
              <td className="px-4 py-3 font-mono text-purple-300">{m.Avg_Daily_Demand}</td>
              <td className={`px-4 py-3 font-mono font-bold ${dsiColor(m.DSI)}`}>
                {m.DSI >= 999 ? "∞" : `${m.DSI}d`}
              </td>
              <td className="px-4 py-3">
                <span className={`rounded px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${statusBadge[m.Status]}`}>
                  {m.Status}
                </span>
              </td>
              <td className={`px-4 py-3 font-mono font-medium ${m.Cash_Trapped > 0 ? "text-amber-300" : "text-zinc-700"}`}>
                {m.Cash_Trapped > 0 ? `$${m.Cash_Trapped.toLocaleString()}` : "—"}
              </td>
              <td className="px-4 py-3 font-mono text-[10px] text-zinc-600">{m.Forecast_Method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
