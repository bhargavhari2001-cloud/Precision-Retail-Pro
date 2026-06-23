import type { InventoryMetric } from "@/types";

/**
 * Reorder engine — classic operations math, zero dependencies.
 * Brings StockTrim/Inventory Planner's core capability (reorder points,
 * suggested order quantities, lead-time awareness) to Precision Retail Pro.
 */

export interface ReorderParams {
  /** Supplier lead time in days (applied to all SKUs unless overridden) */
  leadTimeDays: number;
  /** Extra buffer expressed in days of demand */
  safetyStockDays: number;
  /** Fixed cost per purchase order ($) — for EOQ */
  orderingCost: number;
  /** Annual holding cost as a fraction of unit cost — for EOQ */
  holdingCostRate: number;
  /** What-if demand multiplier (1 = as observed) */
  demandMultiplier: number;
}

export const DEFAULT_REORDER_PARAMS: ReorderParams = {
  leadTimeDays: 14,
  safetyStockDays: 7,
  orderingCost: 50,
  holdingCostRate: 0.25,
  demandMultiplier: 1,
};

export interface ReorderLine {
  SKU: string;
  currentStock: number;
  avgDailyDemand: number;
  reorderPoint: number;
  daysUntilReorder: number;
  /** Suggested order quantity (EOQ, min 0) */
  suggestedQty: number;
  /** Estimated cost of the suggested order */
  estimatedCost: number;
  /** True when stock is already at/below the reorder point */
  orderNow: boolean;
}

export function buildReorderPlan(
  metrics: InventoryMetric[],
  params: ReorderParams = DEFAULT_REORDER_PARAMS
): ReorderLine[] {
  const { leadTimeDays, safetyStockDays, orderingCost, holdingCostRate, demandMultiplier } = params;

  return metrics
    .map((m) => {
      const demand = m.Avg_Daily_Demand * demandMultiplier;
      const safetyStock = demand * safetyStockDays;
      const reorderPoint = demand * leadTimeDays + safetyStock;

      const annualDemand = demand * 365;
      const holdingCost = Math.max(0.01, m.Cost * holdingCostRate);
      const eoq =
        annualDemand > 0 ? Math.sqrt((2 * annualDemand * orderingCost) / holdingCost) : 0;

      const daysUntilReorder =
        demand > 0 ? Math.max(0, (m.Current_Stock - reorderPoint) / demand) : Infinity;

      const suggestedQty = Math.ceil(eoq);
      return {
        SKU: m.SKU,
        currentStock: m.Current_Stock,
        avgDailyDemand: Math.round(demand * 10) / 10,
        reorderPoint: Math.ceil(reorderPoint),
        daysUntilReorder: Number.isFinite(daysUntilReorder)
          ? Math.round(daysUntilReorder)
          : 999,
        suggestedQty,
        estimatedCost: Math.round(suggestedQty * m.Cost * 100) / 100,
        orderNow: m.Current_Stock <= reorderPoint && demand > 0,
      };
    })
    .sort((a, b) => a.daysUntilReorder - b.daysUntilReorder);
}
