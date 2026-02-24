import type { AnalyzeResponse, InventoryRow, SalesRow } from "@/types";

const KEYS = {
  inventory: "prp_inventory",
  sales: "prp_sales",
  analysis: "prp_analysis",
  lastAnalyzed: "prp_last_analyzed",
} as const;

function safe<T>(fn: () => T, fallback: T): T {
  try { return fn(); } catch { return fallback; }
}

export const storage = {
  // ── Inventory ──
  saveInventory(data: InventoryRow[]) {
    safe(() => localStorage.setItem(KEYS.inventory, JSON.stringify(data)), undefined);
  },
  loadInventory(): InventoryRow[] | null {
    return safe(() => {
      const raw = localStorage.getItem(KEYS.inventory);
      return raw ? (JSON.parse(raw) as InventoryRow[]) : null;
    }, null);
  },

  // ── Sales ──
  saveSales(data: SalesRow[]) {
    safe(() => localStorage.setItem(KEYS.sales, JSON.stringify(data)), undefined);
  },
  loadSales(): SalesRow[] | null {
    return safe(() => {
      const raw = localStorage.getItem(KEYS.sales);
      return raw ? (JSON.parse(raw) as SalesRow[]) : null;
    }, null);
  },

  // ── Analysis result ──
  saveAnalysis(result: AnalyzeResponse) {
    safe(() => {
      localStorage.setItem(KEYS.analysis, JSON.stringify(result));
      localStorage.setItem(KEYS.lastAnalyzed, new Date().toISOString());
    }, undefined);
  },
  loadAnalysis(): AnalyzeResponse | null {
    return safe(() => {
      const raw = localStorage.getItem(KEYS.analysis);
      return raw ? (JSON.parse(raw) as AnalyzeResponse) : null;
    }, null);
  },
  loadLastAnalyzed(): string | null {
    return safe(() => localStorage.getItem(KEYS.lastAnalyzed), null);
  },

  clearAll() {
    safe(() => Object.values(KEYS).forEach((k) => localStorage.removeItem(k)), undefined);
  },
};
