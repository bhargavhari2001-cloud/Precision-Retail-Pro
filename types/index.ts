// ── Core data types ──────────────────────────────────────────────────────────

export interface InventoryRow {
  SKU: string;
  Cost: number;
  Price: number;
  Current_Stock: number;
  [key: string]: string | number;
}

export interface SalesRow {
  Date: string;
  SKU: string;
  Sales: number;
}

export type StockStatus = "Urgent Reorder" | "Dead Stock" | "Healthy";
export type ForecastMethod = "Claude AI" | "Moving Average" | "Insufficient Data (Mean)";

export interface InventoryMetric {
  SKU: string;
  Cost: number;
  Price: number;
  Current_Stock: number;
  Avg_Daily_Demand: number;
  DSI: number;
  Status: StockStatus;
  Cash_Trapped: number;
  Forecast_Method: ForecastMethod;
  ABC_Class?: "A" | "B" | "C";
  Revenue_Contribution?: number;
  Forecast_Values?: number[];
  AI_Insight?: string;
}

export interface ForecastPoint {
  date: string;
  value: number;
  type: "Historical" | "Predicted";
}

export interface ForecastResult {
  sku: string;
  points: ForecastPoint[];
  method: ForecastMethod;
  avgDailyDemand: number;
  insight: string;
}

// ── API request / response types ──────────────────────────────────────────────

export interface AnalyzeRequest {
  inventory: InventoryRow[];
  sales: SalesRow[];
}

export interface AnalyzeResponse {
  metrics: InventoryMetric[];
  summary: {
    totalInventoryValue: number;
    totalCashTrapped: number;
    urgentReorderCount: number;
    deadStockCount: number;
    healthyCount: number;
    skuCount: number;
    abc: { A: number; B: number; C: number };
  };
  error?: string;
}

export interface ForecastRequest {
  sku: string;
  salesHistory: SalesRow[];
  currentStock: number;
}

export interface ForecastResponse {
  result: ForecastResult;
  error?: string;
}

// ── App state (Zustand) ───────────────────────────────────────────────────────

export interface AppState {
  inventoryData: InventoryRow[] | null;
  salesData: SalesRow[] | null;
  analysisResult: AnalyzeResponse | null;
  isAnalyzing: boolean;
  lastAnalyzedAt: string | null;

  setInventoryData: (data: InventoryRow[]) => void;
  setSalesData: (data: SalesRow[]) => void;
  setAnalysisResult: (result: AnalyzeResponse) => void;
  setIsAnalyzing: (v: boolean) => void;
  clearAll: () => void;
}

// ── Supabase ──────────────────────────────────────────────────────────────────

export interface AnalysisSession {
  id: string;
  created_at: string;
  inventory_snapshot: InventoryRow[];
  summary: AnalyzeResponse["summary"];
  metrics: InventoryMetric[];
}
