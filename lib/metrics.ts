import type { InventoryRow, SalesRow, InventoryMetric, StockStatus, ForecastMethod } from "@/types";

// ── Moving-average forecast (no AI needed) ────────────────────────────────────

export function movingAverageForecast(
  salesRows: SalesRow[],
  sku: string,
  days = 30
): { avgDailyDemand: number; method: ForecastMethod } {
  const skuSales = salesRows
    .filter((r) => r.SKU === sku)
    .sort((a, b) => a.Date.localeCompare(b.Date));

  if (skuSales.length === 0) return { avgDailyDemand: 0, method: "Insufficient Data (Mean)" };
  if (skuSales.length < 5) {
    const mean = skuSales.reduce((s, r) => s + r.Sales, 0) / skuSales.length;
    return { avgDailyDemand: mean, method: "Insufficient Data (Mean)" };
  }

  const window = skuSales.slice(-Math.min(30, skuSales.length));
  const avg = window.reduce((s, r) => s + r.Sales, 0) / window.length;
  return { avgDailyDemand: avg, method: "Moving Average" };
}

// ── DSI + status calculation ──────────────────────────────────────────────────

export function calcDSI(stock: number, avgDailyDemand: number): number {
  if (avgDailyDemand <= 0.1) return 999;
  return stock / avgDailyDemand;
}

export function calcStatus(dsi: number): StockStatus {
  if (dsi < 14) return "Urgent Reorder";
  if (dsi > 90) return "Dead Stock";
  return "Healthy";
}

// ── Full metrics calculation (fast path, no AI) ───────────────────────────────

export function calculateMetrics(
  inventory: InventoryRow[],
  sales: SalesRow[]
): InventoryMetric[] {
  return inventory.map((row) => {
    const { avgDailyDemand, method } = movingAverageForecast(sales, row.SKU);
    const dsi = calcDSI(row.Current_Stock, avgDailyDemand);
    const status = calcStatus(dsi);
    const cashTrapped = status === "Dead Stock" ? row.Cost * row.Current_Stock : 0;

    return {
      ...row,
      Avg_Daily_Demand: Math.round(avgDailyDemand * 10) / 10,
      DSI: Math.round(dsi * 10) / 10,
      Status: status,
      Cash_Trapped: Math.round(cashTrapped * 100) / 100,
      Forecast_Method: method,
    };
  });
}

// ── Summary stats ─────────────────────────────────────────────────────────────

export function buildSummary(metrics: InventoryMetric[]) {
  return {
    totalInventoryValue: metrics.reduce((s, m) => s + m.Cost * m.Current_Stock, 0),
    totalCashTrapped: metrics.reduce((s, m) => s + m.Cash_Trapped, 0),
    urgentReorderCount: metrics.filter((m) => m.Status === "Urgent Reorder").length,
    deadStockCount: metrics.filter((m) => m.Status === "Dead Stock").length,
    healthyCount: metrics.filter((m) => m.Status === "Healthy").length,
    skuCount: metrics.length,
  };
}
