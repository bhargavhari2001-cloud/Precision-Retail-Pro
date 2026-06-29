"use client";

import { useMemo, useState } from "react";
import { ClipboardList, Download, SlidersHorizontal } from "lucide-react";
import type { InventoryMetric } from "@/types";
import { buildReorderPlan, DEFAULT_REORDER_PARAMS } from "@/lib/reorder";
import { generatePurchaseOrderPdf } from "@/lib/poGenerator";

/**
 * Reorder Plan — lead-time-aware reorder points, EOQ order quantities,
 * a what-if demand slider, and one-click purchase-order PDF export.
 */
export default function ReorderPlan({ metrics }: { metrics: InventoryMetric[] }) {
  const [open, setOpen] = useState(false);
  const [leadTime, setLeadTime] = useState(DEFAULT_REORDER_PARAMS.leadTimeDays);
  const [demandPct, setDemandPct] = useState(100);

  const plan = useMemo(
    () =>
      buildReorderPlan(metrics, {
        ...DEFAULT_REORDER_PARAMS,
        leadTimeDays: leadTime,
        demandMultiplier: demandPct / 100,
      }),
    [metrics, leadTime, demandPct]
  );
  const orderNow = plan.filter((l) => l.orderNow);
  const totalCost = orderNow.reduce((s, l) => s + l.estimatedCost, 0);

  return (
    <div className="mb-6 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.03]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
          <ClipboardList className="w-4 h-4" />
          Reorder plan — {orderNow.length} SKU{orderNow.length !== 1 ? "s" : ""} to order now
          {orderNow.length > 0 && (
            <span className="text-cyan-300/60 font-normal">
              (~${Math.round(totalCost).toLocaleString()})
            </span>
          )}
        </span>
        <span className="text-cyan-300/50 text-xs">{open ? "Hide" : "Show"}</span>
      </button>

      {open && (
        <div className="px-5 pb-5">
          {/* What-if controls */}
          <div className="flex flex-wrap items-center gap-6 mb-4 text-xs text-white/50">
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Lead time: <b className="text-white/80">{leadTime}d</b>
              <input
                type="range" min={1} max={60} value={leadTime}
                onChange={(e) => setLeadTime(Number(e.target.value))}
                className="w-28 accent-cyan-400"
                aria-label="Supplier lead time in days"
              />
            </span>
            <span className="flex items-center gap-2">
              What-if demand: <b className="text-white/80">{demandPct}%</b>
              <input
                type="range" min={50} max={200} step={10} value={demandPct}
                onChange={(e) => setDemandPct(Number(e.target.value))}
                className="w-28 accent-cyan-400"
                aria-label="Demand scenario multiplier"
              />
            </span>
            <button
              onClick={() => generatePurchaseOrderPdf(plan)}
              disabled={orderNow.length === 0}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/25 transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" /> Purchase order PDF
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-white/35 border-b border-white/10">
                  <th className="text-left py-2 pr-4 font-medium">SKU</th>
                  <th className="text-right py-2 pr-4 font-medium">Stock</th>
                  <th className="text-right py-2 pr-4 font-medium">Reorder point</th>
                  <th className="text-right py-2 pr-4 font-medium">Days until reorder</th>
                  <th className="text-right py-2 pr-4 font-medium">Suggested qty (EOQ)</th>
                  <th className="text-right py-2 font-medium">Est. cost</th>
                </tr>
              </thead>
              <tbody>
                {plan.slice(0, 12).map((l) => (
                  <tr key={l.SKU} className="border-b border-white/[0.04] text-white/70">
                    <td className="py-2 pr-4">{l.SKU}</td>
                    <td className="py-2 pr-4 text-right">{l.currentStock}</td>
                    <td className="py-2 pr-4 text-right">{l.reorderPoint}</td>
                    <td className={`py-2 pr-4 text-right ${l.orderNow ? "text-red-400 font-semibold" : ""}`}>
                      {l.orderNow ? "ORDER NOW" : `${l.daysUntilReorder}d`}
                    </td>
                    <td className="py-2 pr-4 text-right">{l.suggestedQty}</td>
                    <td className="py-2 text-right">${l.estimatedCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {plan.length > 12 && (
              <p className="mt-2 text-[11px] text-white/30">
                Showing 12 of {plan.length} — full list included in the PDF.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
